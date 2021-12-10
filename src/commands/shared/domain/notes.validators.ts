export function isValidURL(chunk: string): boolean {
  try {
    const url = new URL(chunk);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}
