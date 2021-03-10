import { Schema, model } from 'mongoose';
import { hash, compare } from 'bcrypt';

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  hash(this.get('password'), 8, (err, hash) => {
    if (err) {
      return next(err);
    }

    this.set('password', hash);
    next();
  });
});

userSchema.methods.checkPassword = function (password) {
  const passwordHash = this.get('password');
  return new Promise((resolve, reject) => {
    compare(password, passwordHash, (err, same) => {
      if (err) {
        return reject(err);
      }

      resolve(same);
    });
  });
};

export const User = model('user', userSchema);
