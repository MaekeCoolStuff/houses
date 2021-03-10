import express from 'express';
import cors from 'cors';
import { json, urlencoded } from 'body-parser';
import { signup, signin, protect } from './utils/auth';
import { connect } from './utils/db';
import userRouter from './resources/user/user.router';

const app = express();
const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_USER_PASSWORD}@${process.env.DB_CLUSTER}.azure.mongodb.net/houses?retryWrites=true&w=majority`;

app.disable('x-powered-by');

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

app.post('/signup', signup);
app.post('/signin', signin);

app.use('/api', protect);
app.use('/api/user', userRouter);

export const start = async () => {
  try {
    await connect(url);
    app.listen(process.env.PORT, () => {
      console.log(`REST API on http://localhost:${process.env.PORT}`);
    });
  } catch (e) {
    console.error(e);
  }
};

start();
