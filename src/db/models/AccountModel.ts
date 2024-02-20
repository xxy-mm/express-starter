import mongoose, { Schema } from 'mongoose'

const accountSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'UserModel',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  details: String,
  isDeleted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now, // using Date.now, not Date.now()
  },
  updatedAt: {
    type: Date,
  },
})

const AccountModel = mongoose.model('account', accountSchema)

interface IAccount {
  user: string
  date: Date
  amount: number
  details: string
}
export const createAccount = async (account: IAccount) => {
  return await AccountModel.create(account)
}

export const deleteAccount = async (_id: string) => {
  return await AccountModel.updateOne(
    { _id },
    { $set: { isDeleted: true, updatedAt: Date.now() } },
    { new: true },
  )
}

interface IListAccountArgs {
  _id: string
  skip: number
  limit: number
}

export const listAccount = async ({ _id, skip, limit }: IListAccountArgs) => {
  return await AccountModel.find({ user: _id, isDeleted: false })
    .skip(skip)
    .limit(limit)
    .sort('createdAt')
    .lean()
}

interface IUpdateAccountArgs {
  _id: string
  amount?: number
  details?: string
}

export const updateAccount = async ({
  _id,
  amount,
  details,
}: IUpdateAccountArgs) => {
  return await AccountModel.findOneAndUpdate(
    { _id },
    {
      amount,
      details,
      updatedAt: Date.now(),
    },
    {
      new: true,
    },
  ).lean()
}

export const findAccountById = async (_id: string) => {
  return AccountModel.findById(_id).lean().exec()
}

export default AccountModel
