import mongoose from 'mongoose';
// TODO: Improve this as soon as docker is setup
const url = `mongodb://localhost:27017/notes`;

mongoose
  // @ts-ignore
  .connect(url, { useNewUrlParser: true })
  .then(() => console.log('Successfully connected'))
  .catch((e) => console.log(e.message));

export default mongoose;
