import { Message } from 'discord.js';
import { createMock } from 'ts-auto-mock';

import {
  BAD_DATE_FORMAT_MESSAGE,
  DatabaseError,
  DATABASE_ERROR_MESSAGE,
  DEFAULT_ERROR_MESSAGE,
} from '../../shared/domain/note.errors';
import { buildMockedMessage } from '../../shared/testUtils/builders';
import rememberHandler from './remember.handler';
import * as rememberService from './remember.service';

jest.mock('./remember.service.ts');

afterEach(() => {
  jest.clearAllMocks();
});

describe('Remember infra tests', () => {
  test('Should execute reply properly if everything went well', async () => {
    // @ts-ignore
    rememberService.saveNote.mockResolvedValue({});
    const mockedMessage = createMock<Message>(buildMockedMessage());

    await rememberHandler.execute(mockedMessage);

    expect(rememberService.saveNote).toHaveBeenCalledTimes(1);
    expect(mockedMessage.reply).toHaveBeenCalledTimes(1);
    expect(mockedMessage.reply).toHaveBeenCalledWith({ content: expect.any(String) });
  });

  test('Should execute reply with error message if a bad formatted note remember time is sent', async () => {
    // @ts-ignore
    rememberService.saveNote.mockResolvedValue({});
    const mockedMessage = createMock<Message>({
      ...buildMockedMessage(),
      content: '-rr 222222222m this is content',
    });

    await rememberHandler.execute(mockedMessage);

    expect(rememberService.saveNote).not.toHaveBeenCalledTimes(1);
    expect(mockedMessage.reply).toHaveBeenCalledTimes(1);
    expect(mockedMessage.reply).toHaveBeenCalledWith({ content: BAD_DATE_FORMAT_MESSAGE });
  });

  test('Should execute reply with error message if a database error ocurred', async () => {
    // @ts-ignore
    rememberService.saveNote.mockRejectedValue(new DatabaseError(DATABASE_ERROR_MESSAGE));
    const mockedMessage = createMock<Message>(buildMockedMessage());

    await rememberHandler.execute(mockedMessage);

    expect(rememberService.saveNote).toHaveBeenCalledTimes(1);
    expect(mockedMessage.reply).toHaveBeenCalledTimes(1);
    expect(mockedMessage.reply).toHaveBeenCalledWith({ content: DATABASE_ERROR_MESSAGE });
  });

  test('Should execute reply with default error message if error is neither database or date one', async () => {
    // @ts-ignore
    rememberService.saveNote.mockRejectedValue(new Error('any error message'));
    const mockedMessage = createMock<Message>(buildMockedMessage());

    await rememberHandler.execute(mockedMessage);

    expect(rememberService.saveNote).toHaveBeenCalledTimes(1);
    expect(mockedMessage.reply).toHaveBeenCalledTimes(1);
    expect(mockedMessage.reply).toHaveBeenCalledWith({ content: DEFAULT_ERROR_MESSAGE });
  });
});
