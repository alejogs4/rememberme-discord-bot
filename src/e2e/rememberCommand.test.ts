import { Message } from 'discord.js';
import { createMock } from 'ts-auto-mock';
import rememberHandler from '../commands/remember/infra/remember.handler';
import { buildMockedMessage } from '../commands/shared/testUtils/builders';
import notesSchema from '../commands/shared/database/notes.schema';

const createRandomString = () => (Math.random() + 1).toString(36).substring(2);

describe('Remember commands e2e tests', () => {
  test('Should save remember note', async () => {
    const messageContent = createRandomString();
    const authorID = createRandomString();
    const mockMessage = buildMockedMessage();

    mockMessage.content = `-rr 2m ${messageContent}`;
    mockMessage.author.id = authorID;

    const message = createMock<Message>(mockMessage);
    await rememberHandler.execute(message);

    const authorNotes = await notesSchema.find({ authorID });
    const existNote = authorNotes.some((note) => note.content === messageContent);

    expect(existNote).toBe(true);
  });

  test('Should not save note if date format is wrong', async () => {
    const messageContent = createRandomString();
    const authorID = createRandomString();
    const mockMessage = buildMockedMessage();

    mockMessage.content = '-rr 2arm content';
    mockMessage.author.id = authorID;

    const message = createMock<Message>(mockMessage);
    await rememberHandler.execute(message);

    const authorNotes = await notesSchema.find({ authorID });
    const existNote = authorNotes.some((note) => note.content === messageContent);

    expect(existNote).toBe(false);
  });
});
