const express = require('express')
const Article = require('./../models/article')
const User = require('./../models/user')
const router = express.Router()


router.get('/',async(req, res) => {
  const articles = await Article.find().sort({ createdAt: 'desc' })
  res.send(articles)
})

router.get('/new', (req, res) => {
  res.render('articles/new', { article: new Article() })
})

router.get('/edit/:id', async (req, res) => {
  const article = await Article.findById(req.params.id)
  res.render('articles/edit', { article: article })
})

router.get('/:slug', async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug })
  let idCreator = article.createdBy.valueOf()
  let author = await User.findById(idCreator)
  if (article == null) res.redirect('/')
  res.render('articles/show', { article: article , author: author, currentUser: req.user })
})

router.post('/', async (req, res, next) => {
  req.article = new Article()
  next()
}, saveArticleAndRedirect('new'))

router.put('/:id', async (req, res, next) => {
  req.article = await Article.findById(req.params.id)
  next()
}, saveArticleAndRedirect('edit'))

router.delete('/:id', async (req, res) => {
  await Article.findByIdAndDelete(req.params.id)
  res.redirect('/')
})

function saveArticleAndRedirect(path) {
  return async (req, res) => {
    let creator = req.user
    let article = req.article
    article.title = req.body.title
    article.description = req.body.description
    article.markdown = req.body.markdown
    article.createdBy = creator._id
    try {
      article = await article.save()
      res.redirect(`/articles/${article.slug}`)
    } catch (e) {
      res.render(`articles/${path}`, { article: article })
    }
  }
}

module.exports = router
