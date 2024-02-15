import mongoose from 'mongoose'



const db = mongoose.connect('mongodb://localhost:27017/test')

  mongoose.connection.on('open', () => {
    console.log('db connection established')
  })

  mongoose.connection.on('error', error => {
    console.error('db connection error:', error)
  })
  mongoose.connection.on('close', () => {
    console.log('db connection closed')
  })

export default db;
