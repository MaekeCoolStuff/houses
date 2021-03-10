import mongoose from 'mongoose';

export const connect = (url: string, opts = {}): Promise<typeof mongoose> => {
  return mongoose.connect(url, {
    ...opts,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};
