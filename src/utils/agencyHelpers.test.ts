import test from 'node:test';
import assert from 'node:assert/strict';
import {
  AGENCY_EMAIL,
  FOOTER_SOCIAL_LINKS,
  FOUNDER_LINKEDIN_URL,
  MAILTO_PROJECT_URL,
  PROJECTS,
  TESTIMONIAL_SLOTS,
} from '../data/agencyData';
import {
  buildMailtoHref,
  filterProjectsByCategory,
  getCursorMode,
  getProjectActionLabel,
  isValidExternalUrl,
} from './agencyHelpers';

test('filterProjectsByCategory returns all projects for All and matches exact category', () => {
  const all = filterProjectsByCategory(PROJECTS, 'All');
  assert.equal(all.length, PROJECTS.length);

  const aiOnly = filterProjectsByCategory(PROJECTS, 'AI Development');
  assert.equal(aiOnly.length, 1);
  assert.equal(aiOnly[0].id, 'ai-assistant');

  const brandingOnly = filterProjectsByCategory(PROJECTS, 'Personal Branding');
  assert.equal(brandingOnly.length, 1);
  assert.equal(brandingOnly[0].id, 'personal-portfolio');
});

test('buildMailtoHref encodes subject cleanly with %20 spaces', () => {
  assert.equal(AGENCY_EMAIL, 'work.shubhjain@gmail.com');
  assert.equal(
    buildMailtoHref(AGENCY_EMAIL, 'New Project Inquiry'),
    MAILTO_PROJECT_URL
  );
  assert.equal(
    buildMailtoHref('work.shubhjain@gmail.com'),
    'mailto:work.shubhjain@gmail.com'
  );
});

test('isValidExternalUrl accepts http/https and rejects unsafe or malformed urls', () => {
  assert.equal(isValidExternalUrl('https://arcitic.example.com'), true);
  assert.equal(isValidExternalUrl('http://localhost:3000'), true);
  assert.equal(isValidExternalUrl('javascript:alert(1)'), false);
  assert.equal(isValidExternalUrl('not-a-url'), false);
  assert.equal(isValidExternalUrl(undefined), false);
});

test('getProjectActionLabel respects externalUrl presence and demo concept status', () => {
  assert.equal(
    getProjectActionLabel({externalUrl: 'https://example.com', isDemoConcept: true}),
    'Visit External Link'
  );
  assert.equal(
    getProjectActionLabel({externalUrl: undefined, isDemoConcept: true}),
    'Inspect Concept'
  );
  assert.equal(
    getProjectActionLabel({externalUrl: undefined, isDemoConcept: false}),
    'View Project'
  );
});

test('getCursorMode disables cursor on touch or reduced-motion devices', () => {
  assert.equal(getCursorMode(false, false, false), 'hidden');
  assert.equal(getCursorMode(true, true, true), 'hidden');
  assert.equal(getCursorMode(true, false, false), 'dot');
  assert.equal(getCursorMode(true, false, true), 'view');
});

test('demo projects, testimonial placeholders, and social links maintain strict integrity', () => {
  assert.ok(PROJECTS.every((project) => project.isDemoConcept === true));
  assert.ok(PROJECTS.every((project) => project.techStack.length > 0));
  assert.ok(PROJECTS.every((project) => project.deliveryTimeline.trim().length > 0));
  assert.ok(TESTIMONIAL_SLOTS.every((slot) => slot.isPlaceholder === true));
  const linkedin = FOOTER_SOCIAL_LINKS.find((item) => item.label === 'LinkedIn');
  assert.equal(linkedin?.href, 'https://www.linkedin.com/company/arcitic');
  assert.equal(isValidExternalUrl(linkedin?.href), true);
  assert.equal(FOUNDER_LINKEDIN_URL, 'https://www.linkedin.com/in/shubh-jain-ai/');
  assert.equal(isValidExternalUrl(FOUNDER_LINKEDIN_URL), true);
  assert.equal(
    FOOTER_SOCIAL_LINKS.some((item) => item.label === 'Telegram'),
    false
  );
  assert.equal(
    FOOTER_SOCIAL_LINKS.some((item) => item.label === 'Instagram'),
    false
  );
});
