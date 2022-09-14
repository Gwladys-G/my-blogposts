const express = require ('express')
const mongoose = require('mongoose')
const Article = require('./models/article')
const articleRouter = require('./routes/articles')
const methodOverride = require('method-override')
const app = express()

mongoose.connect('mongodb://localhost/blog', () =>{
  console.log('DB connected');
})

app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: false}))
app.use(methodOverride('_method'))
app.use('/articles', articleRouter)


app.use('/', async (req,res) => {
  const articles = await Article.find().sort({ createdAt: 'desc' })
  res.render('articles/index',{ articles: articles })
})


app.listen(5000, () => { console.log('Server started')})
