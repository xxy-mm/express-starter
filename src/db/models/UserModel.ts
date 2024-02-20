import { MD5 } from 'crypto-js'
import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  username: String,
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  password: {
    type: String,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
})
const UserModel = mongoose.model('users', UserSchema)

interface ICreateUserArgs {
  email: string
  password: string
}
export const createUser = async ({ email, password }: ICreateUserArgs) => {
  password = MD5(password).toString()
  return await UserModel.create({ email, password })
}

export const deleteUser = async (_id: string) => {
  return await UserModel.findOneAndUpdate(
    { _id },
    { isDeleted: true, updatedAt: Date.now() },
    { new: true },
  ).lean()
}
interface IUpdateUserArgs {
  _id: string
  email?: string
  password?: string
  username?: string
}
export const updateUser = async ({
  _id,
  email,
  password,
  username,
}: IUpdateUserArgs) => {
  return await UserModel.findOneAndUpdate(
    { _id },
    { email, password, username },
    { new: true },
  ).lean()
}
interface IListUsersArgs {
  skip: number
  limit: number
}
export const listUser = async ({ skip, limit }: IListUsersArgs) => {
  return await UserModel.find().skip(skip).limit(limit).lean()
}

export const findUserById = async (_id: string) => {
  return await UserModel.findOne({ _id }).lean()
}

export const findUserByEmail = async (email: string) => {
  return await UserModel.findOne({ email }).lean()
}
interface ICheckUserPasswordArgs {
  email: string
  password: string
}
export const checkUserLogin = async ({
  email,
  password,
}: ICheckUserPasswordArgs) => {
  password = MD5(password).toString()
  const found = await UserModel.findOne({ email, password })
    .select('_id password')
    .exec()

  return found?._id && { _id: found._id.toString(), password: found.password }
}
export default UserModel
