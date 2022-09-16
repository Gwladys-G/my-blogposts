const express = require('express')
const Article = require('./../models/article')
const User = require('./../models/user')
const router = express.Router()

router.get('/', async (req, res) => {
  let users = await User.find()
  // res.send(users)
  res.render('./users/users.ejs',{ users: users })
})

router.delete('/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id)
  res.redirect('/users')
})


module.exports = router