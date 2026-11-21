import type {ProjectCategory, ProjectItem} from '../data/agencyData';

export function filterProjectsByCategory(
  projects: readonly ProjectItem[],
  category: ProjectCategory
): ProjectItem[] {
  if (category === 'All') {
    return [...projects];
  }
  return projects.filter((project) => project.category === category);
}

export function buildMailtoHref(email: string, subject?: string, body?: string): string {
  const params = new URLSearchParams();
  if (subject && subject.trim().length > 0) {
    params.set('subject', subject.trim());
  }
  if (body && body.trim().length > 0) {
    params.set('body', body.trim());
  }
  const queryString = params.toString();
  return queryString ? `mailto:${email}?${queryString.replace(/\+/g, '%20')}` : `mailto:${email}`;
}

export function isValidExternalUrl(url?: string): boolean {
  if (!url) {
    return false;
  }
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

export function getProjectActionLabel(project: Pick<ProjectItem, 'externalUrl' | 'isDemoConcept'>): string {
  if (isValidExternalUrl(project.externalUrl)) {
    return 'Visit External Link';
  }
  return project.isDemoConcept ? 'Inspect Concept' : 'View Project';
}

export function getCursorMode(
  isFinePointer: boolean,
  prefersReducedMotion: boolean,
  isHoveringProject: boolean
): 'hidden' | 'dot' | 'view' {
  if (!isFinePointer || prefersReducedMotion) {
    return 'hidden';
  }
  return isHoveringProject ? 'view' : 'dot';
}
