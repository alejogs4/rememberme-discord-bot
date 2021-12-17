export function buildMockedMessage(currentDate: Date = new Date()) {
  return {
    content: '-rr 2m this is content',
    guild: { id: 'guild' },
    channel: { id: 'channel' },
    author: {
      id: 'authorID',
      username: 'userID',
    },
    createdAt: currentDate,
  };
}
