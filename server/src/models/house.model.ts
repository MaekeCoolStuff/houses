import mongoose, { Schema } from 'mongoose';

const houseModel = new Schema({
  name: { type: String },
});

export default mongoose.model('House', houseModel);
