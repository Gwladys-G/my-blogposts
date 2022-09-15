if (process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
}

const express = require ('express')
const mongoose = require('mongoose')
const Article = require('./models/article')
const User = require('./models/user')
const articleRouter = require('./routes/articles')
const methodOverride = require('method-override')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')

const initializePassport = require('./passport-config')
initializePassport(
 passport,
 async function getUserByEmail(email) {
   let users = await User.find()
   return users.find(user => user.email == email)
 },
 async function getUserById (id) {
   let users = await User.find()
   return users.find(user => user.id == id)
 }
)




// mongoose.connect(process.env.DATABASE_URL, () =>{
//   console.log('DB connected');
// })
mongoose.connect('mongodb://localhost/blog', () =>{
  console.log('DB connected');
})

app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: false}))
app.use(methodOverride('_method'))
app.use('/articles', articleRouter)
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

app.get('/users', async (req, res) => {
  let users = await User.find()
  res.send(users)
})

// Login
app.get('/login', (req, res) => {
  res.render('login.ejs')
})

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

// Register
app.get('/register', (req, res) => {
  res.render('register.ejs')
})

app.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    })
    let user = new User()
    user.name = req.body.name
    user.email = req.body.email
    user.password = hashedPassword
    try{
      user = await user.save()
      res.redirect('/login')
    } catch {
      res.redirect('/register')
    }
  } catch {
    res.redirect('/login')
  }
})


// Logout

app.delete('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
})

// Articles

app.use('/',checkAuthenticated, async (req,res) => {
  const articles = await Article.find().sort({ createdAt: 'desc' })
  res.render('articles/index',{ articles: articles, name: req.user.name  })
})


function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
   return res.redirect('/')
  }
  next()
}

app.listen(5000, () => { console.log('Server started')})
