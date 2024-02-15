import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  age: {
    type: Number,
    default: 18
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'unknown'],
    default: 'unknown'
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
})
const UserModel = mongoose.model('users', UserSchema)

export default UserModel