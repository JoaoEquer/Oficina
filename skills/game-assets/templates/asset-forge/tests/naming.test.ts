import { describe, expect, it } from 'vitest';
import { isAssetFile, isValidAssetName, splitFileName } from '../scripts/lib/naming';

describe('isValidAssetName', () => {
  it.each(['ui_button_hover_01', 'enemy_alien_green_idle_02', 'tile_grass_base_10'])('accepts %s', (name) => {
    expect(isValidAssetName(name)).toBe(true);
  });

  it.each([
    'Hero_Idle_01',
    'hero-idle-01',
    'hero_idle_1',
    'hero_idle',
    'hero_01',
    'hero idle_walk_01',
    '1hero_idle_walk_01',
    'hero_idle_walk_001',
  ])('rejects %s', (name) => {
    expect(isValidAssetName(name)).toBe(false);
  });
});

describe('file helpers', () => {
  it('splits the last extension and lowercases it', () => {
    expect(splitFileName('ui_button_hover_01.PNG')).toEqual({ name: 'ui_button_hover_01', ext: 'png' });
  });

  it('only treats png and jpg as assets', () => {
    expect(isAssetFile('a.png')).toBe(true);
    expect(isAssetFile('a.JPG')).toBe(true);
    expect(isAssetFile('a.psd')).toBe(false);
    expect(isAssetFile('README')).toBe(false);
  });
});
