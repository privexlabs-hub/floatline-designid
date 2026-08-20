import { CANVAS } from '@/lib/artboard-sizes';
import type { Preset, Field, Platform } from '../types';
import { text, area, lines } from '../fields';

const G = 'Profile · Reference';

/**
 * Reference, not deliverable. These catch what a standalone artboard cannot:
 * an avatar colliding with the LinkedIn cover, a bio that overruns X's 160
 * characters. The bio counter turns red when it does.
 */
const pr = (id: string, name: string, platform: Platform, fields: Field[]): Preset => ({
  id: `pr-${id}`, group: G, name, layout: 'profile', ...CANVAS.portrait, surface: 'paper',
  props: { platform }, fields, platform,
});

export const PROFILE_PRESETS: Preset[] = [
  pr('x', 'Profile · X / Twitter', 'x', [
    text('name', 'Name', 'Floatline'),
    text('handle', 'Handle', '@floatline'),
    area('bio', 'Bio', 'Workflow automation for operators who run networks. Broadcast once. Match capacity. Answer once. Read the digest.', 160),
    lines('items', 'Links', ['floatline.app', 'Lagos · remote']),
  ]),
  pr('linkedin', 'Profile · LinkedIn', 'linkedin', [
    text('name', 'Name', 'Floatline'),
    text('handle', 'Handle', 'floatline.app'),
    area('bio', 'Bio', 'The coordination layer for distributed networks. One line between an operator and every person, terminal and system they coordinate — over WhatsApp, SMS, voice, email, Slack or your own API.', 220),
    lines('items', 'Tags', ['Workflow automation', 'Operations', 'Lagos · remote']),
  ]),
  pr('instagram', 'Profile · Instagram', 'instagram', [
    text('name', 'Name', 'floatline'),
    text('handle', 'Handle', '@floatline'),
    area('bio', 'Bio', 'Automation for operators who run networks. Broadcast · capacity · answers · digest.', 150),
    lines('items', 'Links', ['floatline.app']),
  ]),
];
