import mongoose from 'mongoose';

export function startMongoose() {
  const { MONGO_PASSWORD, MONGO_USERNAME, MONGO_DATABASE } = process.env;
  const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@mongo:27017/${MONGO_DATABASE}?authSource=admin`;

  return mongoose
    .connect(url, {
      // @ts-ignore
      useNewUrlParser: true,
    })
    .catch((e) => {
      console.log('Error connecting', e.message);
      return Promise.reject(e);
    });
}

export default mongoose;
