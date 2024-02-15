import express from 'express'
import UserModel from '../db/models/UserModel'
import db from '../db'

const router = express.Router()


router.get('/', (req, res, next) => {
  res.render('register')
})

router.post('/', (req, res, next) => {
  const { username: name, age, gender } = req.body
  db.then(() =>
    UserModel
      .create({
        name,
        age,
        gender
      })
      .then(result => {
        console.log(result)
        res.json(result)
      })
      .catch(err => {
        console.log(err)
        res.send(err)
      }))


})

export default router