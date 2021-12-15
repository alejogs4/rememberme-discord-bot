export const ONE_MS = 1000;
export const TIME_MARKS = [
  { mark: 'm', ms: ONE_MS * 60 },
  { mark: 'h', ms: ONE_MS * 60 * 60 },
  { mark: 'd', ms: ONE_MS * 60 * 60 * 24 },
  { mark: 'w', ms: ONE_MS * 60 * 60 * 24 * 7 },
  { mark: 'M' },
] as const;

export type ITimeMarks = typeof TIME_MARKS[number];
