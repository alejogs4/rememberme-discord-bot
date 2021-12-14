import { Message } from 'discord.js';
import { createMock } from 'ts-auto-mock';

import {
  BAD_DATE_FORMAT_MESSAGE,
  DatabaseError,
  DATABASE_ERROR_MESSAGE,
  DEFAULT_ERROR_MESSAGE,
} from '../../shared/domain/note.errors';
import rememberHandler from './remember.handler';
import * as rememberService from './remember.service';

jest.mock('./remember.service.ts');

afterEach(() => {
  jest.clearAllMocks();
});

const buildMockedMessage = (currentDate: Date = new Date()) => ({
  content: '-rr 2m this is content',
  guild: { id: 'guild' },
  channel: { id: 'channel' },
  author: {
    id: 'authorID',
    username: 'userID',
  },
  createdAt: currentDate,
});

describe('Remember infra tests', () => {
  test('Should execute reply properly if everything went well', async () => {
    const mockSavedNote = jest.fn().mockResolvedValue({});
    // @ts-ignore
    rememberService.saveNote = mockSavedNote;
    const mockedMessage = createMock<Message>(buildMockedMessage());

    await rememberHandler.execute(mockedMessage);

    expect(mockSavedNote).toHaveBeenCalledTimes(1);
    expect(mockedMessage.reply).toHaveBeenCalledTimes(1);
    expect(mockedMessage.reply).toHaveBeenCalledWith({ content: expect.any(String) });
  });

  test('Should execute reply with error message if a bad formatted note remember time is sent', async () => {
    const mockSavedNote = jest.fn().mockResolvedValue({});
    // @ts-ignore
    rememberService.saveNote = mockSavedNote;
    const mockedMessage = createMock<Message>({
      ...buildMockedMessage(),
      content: '-rr 222222222m this is content',
    });

    await rememberHandler.execute(mockedMessage);
    expect(mockSavedNote).not.toHaveBeenCalledTimes(1);
    expect(mockedMessage.reply).toHaveBeenCalledTimes(1);
    expect(mockedMessage.reply).toHaveBeenCalledWith({ content: BAD_DATE_FORMAT_MESSAGE });
  });

  test('Should execute reply with error message if a database error ocurred', async () => {
    const mockSavedNote = jest.fn().mockRejectedValue(new DatabaseError(DATABASE_ERROR_MESSAGE));
    // @ts-ignore
    rememberService.saveNote = mockSavedNote;
    const mockedMessage = createMock<Message>(buildMockedMessage());

    await rememberHandler.execute(mockedMessage);

    expect(mockSavedNote).toHaveBeenCalledTimes(1);
    expect(mockedMessage.reply).toHaveBeenCalledTimes(1);
    expect(mockedMessage.reply).toHaveBeenCalledWith({ content: DATABASE_ERROR_MESSAGE });
  });

  test('Should execute reply with default error message if error is neither database or date one', async () => {
    const mockSavedNote = jest.fn().mockRejectedValue(new Error('any error message'));
    // @ts-ignore
    rememberService.saveNote = mockSavedNote;
    const mockedMessage = createMock<Message>(buildMockedMessage());

    await rememberHandler.execute(mockedMessage);

    expect(mockSavedNote).toHaveBeenCalledTimes(1);
    expect(mockedMessage.reply).toHaveBeenCalledTimes(1);
    expect(mockedMessage.reply).toHaveBeenCalledWith({ content: DEFAULT_ERROR_MESSAGE });
  });
});
