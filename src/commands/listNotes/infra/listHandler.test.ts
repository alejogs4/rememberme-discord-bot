import { add } from 'date-fns';
import { Message } from 'discord.js';
import { createMock, createMockList } from 'ts-auto-mock';
import { NoteContent } from '../../shared/domain/note';
import { DatabaseError, DATABASE_ERROR_MESSAGE, DEFAULT_LISTING_ERROR_MESSAGE } from '../../shared/domain/note.errors';
import { buildMockedMessage } from '../../shared/testUtils/builders';
import { buildNoSavedNotesMessages } from '../domain/listNotes.mapper';
import listCommand from './list.handler';
import * as listService from './list.service';

afterEach(() => {
  jest.clearAllMocks();
});

jest.mock('./list.service.ts');

describe('list notes handler tests', () => {
  test('Should return a proper list string to through message', async () => {
    const notes = createMockList<NoteContent>(5, () => ({ date: add(new Date(), { minutes: 5 }) }));
    // @ts-ignore
    listService.getAuthorNotesClosestToDate.mockResolvedValue(notes);
    const message = createMock<Message>(buildMockedMessage());

    await listCommand.execute(message);

    expect(message.reply).toHaveBeenCalledTimes(1);
    // @ts-ignore
    const replyContent: string = message.reply.mock.calls[0][0].content;
    const expectedListingItems = ['1', '2', '3', '4', '5'];
    expectedListingItems.forEach((listItem) => {
      expect(replyContent.includes(listItem)).toBe(true);
    });
  });

  test('Should reply with a message saying no notes are scheduled for this user', async () => {
    // @ts-ignore
    listService.getAuthorNotesClosestToDate.mockResolvedValue([]);
    const messageContent = buildMockedMessage();
    const message = createMock<Message>(messageContent);

    await listCommand.execute(message);
    expect(message.reply).toHaveBeenCalledTimes(1);
    expect(message.reply).toHaveBeenCalledWith({
      content: buildNoSavedNotesMessages(messageContent.author.id),
    });
  });

  test('Should reply with error in database if this error ocurred', async () => {
    // @ts-ignore
    listService.getAuthorNotesClosestToDate.mockRejectedValue(new DatabaseError(DATABASE_ERROR_MESSAGE));
    const message = createMock<Message>(buildMockedMessage());

    await listCommand.execute(message);

    expect(message.reply).toHaveBeenCalledTimes(1);
    expect(message.reply).toHaveBeenCalledWith({
      content: DATABASE_ERROR_MESSAGE,
    });
  });

  test('Should reply with default error message if is a non identified error', async () => {
    // @ts-ignore
    listService.getAuthorNotesClosestToDate.mockRejectedValue(new Error());
    const message = createMock<Message>(buildMockedMessage());

    await listCommand.execute(message);
    expect(message.reply).toHaveBeenCalledTimes(1);
    expect(message.reply).toHaveBeenCalledWith({
      content: DEFAULT_LISTING_ERROR_MESSAGE,
    });
  });
});
