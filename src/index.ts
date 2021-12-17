if (process.env.ENV === 'dev') require('dotenv').config();
import startBot from './bot';

startBot();
