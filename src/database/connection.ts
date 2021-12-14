import mongoose from 'mongoose';

export function startMongoose() {
  // TODO: Improve this as soon as docker is setup
  const url = `mongodb://localhost:27017/notes`;
  return (
    mongoose
      // @ts-ignore
      .connect(url, { useNewUrlParser: true })
  );
}

export default mongoose;
