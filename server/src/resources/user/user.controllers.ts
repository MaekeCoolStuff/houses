import { User } from './user.model';

export const me = (req: any, res: any): any => {
  res.status(200).json({
    result: req.user,
  });
};

export const updateMe = async (req: any, res: any) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
    })
      .lean()
      .exec();

    res.status(200).json({
      result: user,
    });
  } catch (e) {
    console.error(e);
    res.status(400).end();
  }
};
