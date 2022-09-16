const express = require('express')
const Article = require('./../models/article')
const User = require('./../models/user')
const router = express.Router()

router.get('/',checkAdmin, async (req, res) => {
  let users = await User.find()
  // res.send(users)
  res.render('./users/users.ejs',{ users: users })
})

router.delete('/:id', async (req, res) => {
  let user = await User.findById(req.params.id)
  await Article.deleteMany({ createdBy: user })
  await User.findByIdAndDelete(req.params.id)
  res.redirect('/users')
})


async function checkAdmin (req, res, next) {
  if (req.isAuthenticated()) {
    let findadmin = await User.findById("6324c7d8a079f9740f7d9ea7")
    let admin = findadmin._id.valueOf()
    let currentUser = req.user.id
    if(currentUser === admin){
      return next()
    }
    return res.redirect('/')
  }
  res.redirect('/login')
}


module.exports = router
