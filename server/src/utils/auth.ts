import { User } from '../resources/user/user.model';
import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET ?? '';

export const newToken = (user: any) => {
  return jwt.sign({ id: user.id, email: user.email }, secret, {
    expiresIn: '100d',
  });
};

export const verifyToken = (token: any) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err: any, payload: any) => {
      if (err) return reject(err);
      resolve(payload);
    });
  });

export const signup = async (req: any, res: any) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({ message: 'need email and password' });
  }

  try {
    const user = await User.create(req.body);
    const token = newToken(user);
    return res.status(201).send({ token });
  } catch (e) {
    return res.status(500).end();
  }
};

export const signin = async (req: any, res: any) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({ message: 'need email and password' });
  }

  const invalid = { message: 'Invalid email and password combination' };

  try {
    const user: any = await User.findOne({ email: req.body.email })
      .select('email password')
      .exec();
    console.log('user', user);

    if (!user) {
      return res.status(401).send(invalid);
    }

    const match = await user.checkPassword(req.body.password);

    if (!match) {
      return res.status(401).send(invalid);
    }

    const token = newToken(user);
    return res
      .status(201)
      .send({ token, user: { email: user.get('email'), id: user['_id'] } });
  } catch (e) {
    console.error(e);
    res.status(500).end();
  }
};

export const protect = async (req: any, res: any, next: any) => {
  const bearer = req.headers.authorization;

  if (!bearer || !bearer.startsWith('Bearer ')) {
    return res.status(401).end();
  }

  const token = bearer.split('Bearer ')[1].trim();
  let payload: any;
  try {
    payload = await verifyToken(token);
  } catch (e) {
    return res.status(401).end();
  }

  const user = await User.findById(payload.id)
    .select('-password')
    .lean()
    .exec();

  if (!user) {
    return res.status(401).end();
  }

  req.user = user;
  next();
};
