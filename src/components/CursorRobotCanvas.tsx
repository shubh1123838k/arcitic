import {useEffect, useRef, useState} from 'react';
import * as THREE from 'three';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {
  computeBlinkScaleY,
  computeNormalizedPointer,
  computeRobotLookTargets,
  dampValue,
} from '../utils/robotKinematics';

function detectSoftwareWebGL(): boolean {
  if (typeof document === 'undefined') return false;
  const probeCanvas = document.createElement('canvas');
  const gl = probeCanvas.getContext('webgl2') || probeCanvas.getContext('webgl');
  if (!gl) return true;
  const ext = gl.getExtension('WEBGL_debug_renderer_info');
  const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
  const rendererString = String(gl.getParameter(param) ?? '');
  gl.getExtension('WEBGL_lose_context')?.loseContext();
  return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(rendererString);
}

function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(128, 128, 12, 128, 128, 124);
    grad.addColorStop(0, 'rgba(241, 106, 89, 0.24)');
    grad.addColorStop(0.45, 'rgba(0, 0, 0, 0.65)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createBrushedMetalBumpTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, 128, 128);
    for (let y = 0; y < 128; y += 2) {
      const tone = 116 + Math.round(Math.sin(y * 0.7) * 14 + (y % 4 === 0 ? 10 : -8));
      ctx.fillStyle = `rgb(${tone}, ${tone}, ${tone})`;
      ctx.fillRect(0, y, 128, 1);
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 3);
  return texture;
}

export function CursorRobotCanvas() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [pulseCount, setPulseCount] = useState(0);
  const pulseBoostRef = useRef(0);

  useEffect(() => {
    const containerEl = containerRef.current;
    const mountEl = mountRef.current;
    if (!containerEl || !mountEl) return;
    const container: HTMLDivElement = containerEl;
    const mount: HTMLDivElement = mountEl;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isSoftwareGl = detectSoftwareWebGL();

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c0c0d);
    scene.fog = new THREE.FogExp2(0x0c0c0d, 0.055);

    const width = Math.max(mount.clientWidth, 320);
    const height = Math.max(mount.clientHeight, 320);
    const camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 40);
    camera.position.set(0, 0.24, 6.25);
    camera.lookAt(0, 0.06, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height, false);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    mount.appendChild(renderer.domElement);

    // Studio reflection environment for crisp brushed metal & glass visor highlights
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;
    pmremGenerator.dispose();

    // 3-Point Warm / Cool Studio Lighting Rig
    const hemiLight = new THREE.HemisphereLight(0xcdd6e8, 0x1e1917, 0.85);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff1e8, 2.3);
    keyLight.position.set(3.2, 4.4, 4.5);
    if (!isSoftwareGl) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1024, 1024);
      keyLight.shadow.camera.near = 1;
      keyLight.shadow.camera.far = 14;
      keyLight.shadow.camera.left = -2.5;
      keyLight.shadow.camera.right = 2.5;
      keyLight.shadow.camera.top = 2.5;
      keyLight.shadow.camera.bottom = -2.5;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xf16a59, 1.9);
    rimLight.position.set(-3.4, 2.1, -2.8);
    scene.add(rimLight);

    const visorFillLight = new THREE.PointLight(0xf16a59, 0.9, 6, 2);
    visorFillLight.position.set(0, 0.4, 2.3);
    scene.add(visorFillLight);

    // Shared procedural textures & PBR material palette (distinct roughness/metalness contrast)
    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const brushedBump = createBrushedMetalBumpTexture();
    brushedBump.anisotropy = maxAniso;
    const shadowTex = createContactShadowTexture();

    const matShellMatte = new THREE.MeshStandardMaterial({
      color: 0x202024,
      roughness: 0.44,
      metalness: 0.25,
    });
    const matShellDark = new THREE.MeshStandardMaterial({
      color: 0x121215,
      roughness: 0.68,
      metalness: 0.15,
    });
    const matBrushedAlloy = new THREE.MeshPhysicalMaterial({
      color: 0x7e7973,
      roughness: 0.22,
      metalness: 0.9,
      anisotropy: 0.75,
      bumpMap: brushedBump,
      bumpScale: 0.005,
    });
    const matVisorGlass = new THREE.MeshPhysicalMaterial({
      color: 0x050507,
      roughness: 0.06,
      metalness: 0.22,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      ior: 1.54,
    });
    const matEyeCoral = new THREE.MeshStandardMaterial({
      color: 0xf16a59,
      emissive: 0xd94838,
      emissiveIntensity: 1.15,
      roughness: 0.18,
      metalness: 0.05,
    });
    const matEyeHighlight = new THREE.MeshStandardMaterial({
      color: 0xf1efeb,
      emissive: 0xf1efeb,
      emissiveIntensity: 1.2,
      roughness: 0.15,
      metalness: 0.0,
    });
    const matPedestalRing = new THREE.MeshStandardMaterial({
      color: 0x262523,
      roughness: 0.55,
      metalness: 0.65,
    });

    const geometries: THREE.BufferGeometry[] = [];
    const trackGeo = <T extends THREE.BufferGeometry>(g: T): T => {
      geometries.push(g);
      return g;
    };

    // Ground contact shadow + minimal architectural halo ring
    const shadowGeo = trackGeo(new THREE.CircleGeometry(1.55, 48));
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.85,
    });
    const contactShadow = new THREE.Mesh(shadowGeo, shadowMat);
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.set(0, -1.14, 0);
    scene.add(contactShadow);

    const haloGeo = trackGeo(new THREE.RingGeometry(1.06, 1.095, 64));
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xf16a59,
      transparent: true,
      opacity: 0.24,
      side: THREE.DoubleSide,
    });
    const haloRing = new THREE.Mesh(haloGeo, haloMat);
    haloRing.rotation.x = -Math.PI / 2;
    haloRing.position.set(0, -1.12, 0);
    scene.add(haloRing);

    // Master Robot Root (floats gently above pedestal shadow)
    const robotRoot = new THREE.Group();
    robotRoot.position.set(0, 0.2, 0);
    scene.add(robotRoot);

    // 1. Upper Torso / Sculpted Chest Group (moves with subtle lag behind head)
    const torsoGroup = new THREE.Group();
    torsoGroup.position.set(0, -0.56, 0);
    robotRoot.add(torsoGroup);

    const chestGeo = trackGeo(new RoundedBoxGeometry(1.32, 0.92, 0.8, 10, 0.26));
    const chestMesh = new THREE.Mesh(chestGeo, matShellMatte);
    chestMesh.castShadow = !isSoftwareGl;
    chestMesh.receiveShadow = !isSoftwareGl;
    torsoGroup.add(chestMesh);

    // Collar Ring (LatheGeometry)
    const collarPoints = [
      new THREE.Vector2(0.28, 0),
      new THREE.Vector2(0.42, 0.04),
      new THREE.Vector2(0.44, 0.13),
      new THREE.Vector2(0.32, 0.17),
      new THREE.Vector2(0.22, 0.17),
    ];
    const collarGeo = trackGeo(new THREE.LatheGeometry(collarPoints, 32));
    const collarMesh = new THREE.Mesh(collarGeo, matBrushedAlloy);
    collarMesh.position.set(0, 0.42, 0);
    torsoGroup.add(collarMesh);

    // Recessed Chest Core Badge (ARCITIC Coral Beacon)
    const badgeRingGeo = trackGeo(new THREE.TorusGeometry(0.14, 0.022, 16, 36));
    const badgeRing = new THREE.Mesh(badgeRingGeo, matBrushedAlloy);
    badgeRing.position.set(0, 0.04, 0.4);
    torsoGroup.add(badgeRing);

    const badgeCoreGeo = trackGeo(new THREE.CylinderGeometry(0.085, 0.085, 0.04, 28));
    const badgeCore = new THREE.Mesh(badgeCoreGeo, matEyeCoral);
    badgeCore.rotation.x = Math.PI / 2;
    badgeCore.position.set(0, 0.04, 0.39);
    torsoGroup.add(badgeCore);

    // Floating Articulated Shoulder Pods
    const shoulderGeo = trackGeo(new THREE.CapsuleGeometry(0.15, 0.22, 8, 20));
    const shoulderJointGeo = trackGeo(new THREE.CylinderGeometry(0.075, 0.075, 0.22, 18));

    const leftShoulder = new THREE.Group();
    leftShoulder.position.set(-0.88, 0.05, 0);
    leftShoulder.rotation.z = 0.14;
    const leftShoulderMesh = new THREE.Mesh(shoulderGeo, matShellDark);
    const leftJointMesh = new THREE.Mesh(shoulderJointGeo, matBrushedAlloy);
    leftJointMesh.rotation.z = Math.PI / 2;
    leftJointMesh.position.set(0.16, 0.04, 0);
    leftShoulder.add(leftShoulderMesh, leftJointMesh);
    torsoGroup.add(leftShoulder);

    const rightShoulder = new THREE.Group();
    rightShoulder.position.set(0.88, 0.05, 0);
    rightShoulder.rotation.z = -0.14;
    const rightShoulderMesh = new THREE.Mesh(shoulderGeo, matShellDark);
    const rightJointMesh = new THREE.Mesh(shoulderJointGeo, matBrushedAlloy);
    rightJointMesh.rotation.z = Math.PI / 2;
    rightJointMesh.position.set(-0.16, 0.04, 0);
    rightShoulder.add(rightShoulderMesh, rightJointMesh);
    torsoGroup.add(rightShoulder);

    // Lower Waist Taper Base
    const waistGeo = trackGeo(new THREE.CylinderGeometry(0.42, 0.28, 0.26, 28));
    const waistMesh = new THREE.Mesh(waistGeo, matPedestalRing);
    waistMesh.position.set(0, -0.52, 0);
    torsoGroup.add(waistMesh);

    // 2. Articulated Neck Gimbal
    const neckGroup = new THREE.Group();
    neckGroup.position.set(0, 0.04, 0);
    robotRoot.add(neckGroup);

    const neckStemGeo = trackGeo(new THREE.CylinderGeometry(0.16, 0.2, 0.36, 24));
    const neckStem = new THREE.Mesh(neckStemGeo, matShellDark);
    neckGroup.add(neckStem);

    // 3. Sculpted Head & Expressive Visor Group (primary cursor follower)
    const headPivot = new THREE.Group();
    headPivot.position.set(0, 0.56, 0);
    robotRoot.add(headPivot);

    // Primary Helmet Chassis (Seamless RoundedBoxGeometry)
    const headShellGeo = trackGeo(new RoundedBoxGeometry(1.76, 1.38, 1.28, 12, 0.36));
    const headShell = new THREE.Mesh(headShellGeo, matShellMatte);
    headShell.castShadow = !isSoftwareGl;
    headShell.receiveShadow = !isSoftwareGl;
    headPivot.add(headShell);

    // Metallic Bezel Frame around Visor
    const bezelGeo = trackGeo(new RoundedBoxGeometry(1.42, 0.94, 0.14, 8, 0.22));
    const bezelMesh = new THREE.Mesh(bezelGeo, matBrushedAlloy);
    bezelMesh.position.set(0, 0.01, 0.58);
    headPivot.add(bezelMesh);

    // Deep Glossy Obsidian Visor Screen
    const visorGeo = trackGeo(new RoundedBoxGeometry(1.28, 0.8, 0.12, 8, 0.18));
    const visorMesh = new THREE.Mesh(visorGeo, matVisorGlass);
    visorMesh.position.set(0, 0.01, 0.61);
    headPivot.add(visorMesh);

    // Expressive Eye Gaze Sub-group (tracks pointer with subtle inner parallax)
    const eyeGazeGroup = new THREE.Group();
    eyeGazeGroup.position.set(0, 0.02, 0.685);
    headPivot.add(eyeGazeGroup);

    const eyeGeo = trackGeo(new THREE.CapsuleGeometry(0.088, 0.14, 8, 20));
    const eyeDotGeo = trackGeo(new THREE.SphereGeometry(0.024, 12, 12));

    const leftEyePivot = new THREE.Group();
    leftEyePivot.position.set(-0.27, 0.03, 0);
    const leftEyeMesh = new THREE.Mesh(eyeGeo, matEyeCoral);
    leftEyeMesh.scale.set(1, 1, 0.38);
    const leftEyeSpec = new THREE.Mesh(eyeDotGeo, matEyeHighlight);
    leftEyeSpec.position.set(0.028, 0.045, 0.034);
    leftEyePivot.add(leftEyeMesh, leftEyeSpec);

    const rightEyePivot = new THREE.Group();
    rightEyePivot.position.set(0.27, 0.03, 0);
    const rightEyeMesh = new THREE.Mesh(eyeGeo, matEyeCoral);
    rightEyeMesh.scale.set(1, 1, 0.38);
    const rightEyeSpec = new THREE.Mesh(eyeDotGeo, matEyeHighlight);
    rightEyeSpec.position.set(0.028, 0.045, 0.034);
    rightEyePivot.add(rightEyeMesh, rightEyeSpec);

    // Subtle friendly coral expression micro-bar inside lower visor
    const smileGeo = trackGeo(new THREE.CapsuleGeometry(0.02, 0.14, 6, 14));
    const smileMesh = new THREE.Mesh(smileGeo, matEyeCoral);
    smileMesh.rotation.z = Math.PI / 2;
    smileMesh.scale.set(1, 1, 0.45);
    smileMesh.position.set(0, -0.19, 0);

    eyeGazeGroup.add(leftEyePivot, rightEyePivot, smileMesh);

    // Side Ear-Pods + Glowing Rings
    const earPodGeo = trackGeo(new THREE.CylinderGeometry(0.23, 0.25, 0.14, 28));
    const earCapGeo = trackGeo(new THREE.CylinderGeometry(0.14, 0.14, 0.18, 24));
    const earRingGeo = trackGeo(new THREE.TorusGeometry(0.18, 0.016, 12, 32));

    const leftEar = new THREE.Group();
    leftEar.position.set(-0.92, 0.02, 0);
    leftEar.rotation.z = Math.PI / 2;
    leftEar.add(
      new THREE.Mesh(earPodGeo, matShellDark),
      new THREE.Mesh(earCapGeo, matBrushedAlloy),
    );
    const leftEarRing = new THREE.Mesh(earRingGeo, matEyeCoral);
    leftEarRing.rotation.x = Math.PI / 2;
    leftEarRing.position.set(0, 0.072, 0);
    leftEar.add(leftEarRing);
    headPivot.add(leftEar);

    const rightEar = new THREE.Group();
    rightEar.position.set(0.92, 0.02, 0);
    rightEar.rotation.z = -Math.PI / 2;
    rightEar.add(
      new THREE.Mesh(earPodGeo, matShellDark),
      new THREE.Mesh(earCapGeo, matBrushedAlloy),
    );
    const rightEarRing = new THREE.Mesh(earRingGeo, matEyeCoral);
    rightEarRing.rotation.x = Math.PI / 2;
    rightEarRing.position.set(0, 0.072, 0);
    rightEar.add(rightEarRing);
    headPivot.add(rightEar);

    // Twin Top Sensor Antennas with Coral Tips
    const antennaCurveL = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.34, 0.68, -0.05),
      new THREE.Vector3(-0.39, 0.86, -0.09),
      new THREE.Vector3(-0.42, 0.98, -0.14),
    ]);
    const antennaCurveR = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.34, 0.68, -0.05),
      new THREE.Vector3(0.39, 0.86, -0.09),
      new THREE.Vector3(0.42, 0.98, -0.14),
    ]);
    const antennaGeoL = trackGeo(new THREE.TubeGeometry(antennaCurveL, 12, 0.028, 10, false));
    const antennaGeoR = trackGeo(new THREE.TubeGeometry(antennaCurveR, 12, 0.028, 10, false));
    const tipGeo = trackGeo(new THREE.SphereGeometry(0.055, 16, 16));

    const antennaLeftMesh = new THREE.Mesh(antennaGeoL, matBrushedAlloy);
    const antennaRightMesh = new THREE.Mesh(antennaGeoR, matBrushedAlloy);
    const tipL = new THREE.Mesh(tipGeo, matEyeCoral);
    tipL.position.set(-0.42, 0.99, -0.14);
    const tipR = new THREE.Mesh(tipGeo, matEyeCoral);
    tipR.position.set(0.42, 0.99, -0.14);
    headPivot.add(antennaLeftMesh, antennaRightMesh, tipL, tipR);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Live cursor & kinematics state (zero GC allocations inside animation loop)
    let pointerClientX = window.innerWidth * 0.55;
    let pointerClientY = window.innerHeight * 0.42;
    let hasUserPointer = false;
    let isHovered = false;
    let isInViewport = true;

    let currentHeadYaw = 0.08;
    let currentHeadPitch = -0.04;
    let currentTorsoYaw = 0.03;
    let currentTorsoPitch = -0.02;
    let currentEyeX = 0;
    let currentEyeY = 0;
    let elapsed = 0;
    let lastTimestamp = performance.now();
    let frameId = 0;
    let destroyed = false;

    const updateDOMState = () => {
      container.dataset.headYaw = currentHeadYaw.toFixed(3);
      container.dataset.headPitch = currentHeadPitch.toFixed(3);
      container.dataset.hovered = String(isHovered);
    };

    const onPointerMove = (e: PointerEvent) => {
      pointerClientX = e.clientX;
      pointerClientY = e.clientY;
      hasUserPointer = true;
    };

    const onPointerEnter = (e: PointerEvent) => {
      isHovered = true;
      pointerClientX = e.clientX;
      pointerClientY = e.clientY;
      hasUserPointer = true;
    };

    const onPointerLeave = () => {
      isHovered = false;
    };

    window.addEventListener('pointermove', onPointerMove, {passive: true});
    container.addEventListener('pointerenter', onPointerEnter, {passive: true});
    container.addEventListener('pointerleave', onPointerLeave, {passive: true});

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const w = Math.max(Math.round(entry.contentRect.width), 240);
      const h = Math.max(Math.round(entry.contentRect.height), 240);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    });
    resizeObserver.observe(mount);

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        const wasVisible = isInViewport;
        isInViewport = entry.isIntersecting;
        if (isInViewport && !wasVisible && !destroyed && frameId === 0) {
          lastTimestamp = performance.now();
          scheduleNext();
        }
      },
      {rootMargin: '180px 0px'},
    );
    intersectionObserver.observe(container);

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync?.(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      if (!sync) {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const poll = () => {
        if (destroyed) {
          gl.deleteSync(sync);
          return;
        }
        const state = gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function stepAndRender(now: number) {
      if (destroyed) return;
      frameId = 0;

      const dt = Math.min((now - lastTimestamp) / 1000, 0.08);
      lastTimestamp = now;
      elapsed += dt;

      // Decay click greeting pulse
      if (pulseBoostRef.current > 0.001) {
        pulseBoostRef.current = dampValue(pulseBoostRef.current, 0, 5.5, dt);
      } else {
        pulseBoostRef.current = 0;
      }

      // Compute normalized target either from pointer or gentle autonomous idle glance
      let nx = 0;
      let ny = 0;
      if (hasUserPointer) {
        const rect = mount.getBoundingClientRect();
        const norm = computeNormalizedPointer(
          pointerClientX,
          pointerClientY,
          window.innerWidth,
          window.innerHeight,
          rect,
        );
        nx = norm.nx;
        ny = norm.ny;
      } else if (!prefersReducedMotion) {
        nx = Math.sin(elapsed * 0.65) * 0.35;
        ny = Math.cos(elapsed * 0.45) * 0.2;
      }

      const targets = computeRobotLookTargets(nx, ny, isHovered);
      const nodOffset = pulseBoostRef.current * 0.22;

      const smoothLambda = prefersReducedMotion ? 16 : 9.5;
      currentHeadYaw = dampValue(currentHeadYaw, targets.headYaw, smoothLambda, dt);
      currentHeadPitch = dampValue(currentHeadPitch, targets.headPitch + nodOffset, smoothLambda, dt);
      currentTorsoYaw = dampValue(currentTorsoYaw, targets.torsoYaw, smoothLambda * 0.65, dt);
      currentTorsoPitch = dampValue(currentTorsoPitch, targets.torsoPitch + nodOffset * 0.4, smoothLambda * 0.65, dt);
      currentEyeX = dampValue(currentEyeX, targets.eyeOffsetX, smoothLambda * 1.4, dt);
      currentEyeY = dampValue(currentEyeY, targets.eyeOffsetY, smoothLambda * 1.4, dt);

      headPivot.rotation.set(currentHeadPitch, currentHeadYaw, -currentHeadYaw * 0.14);
      torsoGroup.rotation.set(currentTorsoPitch, currentTorsoYaw, -currentTorsoYaw * 0.08);
      eyeGazeGroup.position.set(currentEyeX, 0.02 + currentEyeY, 0.685);

      if (!prefersReducedMotion) {
        const floatY = Math.sin(elapsed * 1.8) * 0.055;
        robotRoot.position.y = 0.2 + floatY + pulseBoostRef.current * 0.05;
        leftShoulder.position.y = 0.05 + Math.sin(elapsed * 1.8 + 0.6) * 0.025;
        rightShoulder.position.y = 0.05 + Math.sin(elapsed * 1.8 + 0.6) * 0.025;

        const blinkScaleY = computeBlinkScaleY(elapsed / 3.6);
        leftEyePivot.scale.y = blinkScaleY;
        rightEyePivot.scale.y = blinkScaleY;

        const pulseEmissive = 1.15 + pulseBoostRef.current * 1.65 + (isHovered ? 0.28 : 0);
        matEyeCoral.emissiveIntensity = pulseEmissive;
        haloMat.opacity = 0.22 + (isHovered ? 0.16 : 0) + pulseBoostRef.current * 0.25;
      }

      updateDOMState();
      renderer.render(scene, camera);

      if (isInViewport && !destroyed) {
        scheduleNext();
      }
    }

    function scheduleNext() {
      if (destroyed) return;
      if (isSoftwareGl) {
        afterDraw(() => stepAndRender(performance.now()));
      } else {
        frameId = requestAnimationFrame(stepAndRender);
      }
    }

    // Initial frame immediately so first paint shows crisp robot
    stepAndRender(performance.now());

    return () => {
      destroyed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerenter', onPointerEnter);
      container.removeEventListener('pointerleave', onPointerLeave);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();

      for (const geo of geometries) {
        geo.dispose();
      }
      matShellMatte.dispose();
      matShellDark.dispose();
      matBrushedAlloy.dispose();
      matVisorGlass.dispose();
      matEyeCoral.dispose();
      matEyeHighlight.dispose();
      matPedestalRing.dispose();
      shadowMat.dispose();
      haloMat.dispose();
      brushedBump.dispose();
      shadowTex.dispose();
      envTexture.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  const handleInteract = () => {
    pulseBoostRef.current = 1.0;
    setPulseCount((c) => c + 1);
  };

  return (
    <div
      ref={containerRef}
      data-testid="cursor-robot-canvas"
      data-pulse-count={pulseCount}
      className="relative h-full min-h-[380px] w-full select-none bg-[#0c0c0d] lg:min-h-[520px]"
    >
      {/* Dedicated isolated WebGL mount node */}
      <div
        ref={mountRef}
        onClick={handleInteract}
        className="h-full w-full cursor-pointer"
      />

      {/* Clean non-overlapping interactive prompt + accessible pulse button */}
      <div className="pointer-events-none absolute inset-x-4 bottom-4 flex items-center justify-between gap-3">
        <span className="border border-white/10 bg-[#090909]/85 px-3 py-1.5 font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Cursor Tracking · Interactive 3D
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleInteract();
          }}
          aria-label="Ping ARCITIC robot"
          className="pointer-events-auto border border-white/15 bg-[#090909]/90 px-3 py-1.5 font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-foreground transition-colors duration-200 hover:border-primary/60 hover:text-primary-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Signal Unit
        </button>
      </div>
    </div>
  );
}
