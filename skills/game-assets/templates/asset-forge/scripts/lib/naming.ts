export const ASSET_EXTENSIONS = ['png', 'jpg', 'jpeg'] as const;

/** categoria_objeto_estado_01: at least three snake_case words, then a two-digit index. */
const NAME_PATTERN = /^[a-z][a-z0-9]*(_[a-z][a-z0-9]*){2,}_\d{2}$/;

export function isValidAssetName(name: string): boolean {
  return NAME_PATTERN.test(name);
}

export function splitFileName(file: string): { name: string; ext: string } {
  const dot = file.lastIndexOf('.');
  if (dot <= 0) return { name: file, ext: '' };
  return { name: file.slice(0, dot), ext: file.slice(dot + 1).toLowerCase() };
}

export function isAssetFile(file: string): boolean {
  const { ext } = splitFileName(file);
  return (ASSET_EXTENSIONS as readonly string[]).includes(ext);
}

export function describeNameRule(name: string): string {
  return `"${name}" does not match categoria_objeto_estado_01 (lowercase snake_case, 3+ words, two-digit index)`;
}
