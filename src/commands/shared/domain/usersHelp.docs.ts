type CommandDocumentation = {
  title: string;
  description: string;
};

export const commandsDescription: Array<CommandDocumentation> = [
  {
    title: '-rr',
    description: `Scheduled a reminder note based on a date this date can be:

Relative date with a number value eg: 1m, 2m, 1h, 3h, 1d, 2w, 1M
  
The supported time marks are:
- m: minute
- h: hour
- d: day
- w: week
- M: month
  
Or you can schedule your note for an specific date eg: 2020/12/01, 2020/12/01, 2020-12-01
`,
  },
  {
    title: '-ll',
    description: `List your scheduled notes ordered from the closest to the farthest to be reminded`,
  },
];
