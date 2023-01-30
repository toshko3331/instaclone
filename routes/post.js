const express = require('express');
const postRouter = express.Router();
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(process.env.MEDIA_STORAGE_PATH))
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, (file.originalname.slice(0, 100)  + '-' + uniqueSuffix).slice(0,150) 
      + path.extname(file.originalname).slice(0,170))
  }
})

const upload = multer({
  storage: storage,
  limits: { fileSize: 20000000 }, //20 Mbs
}).single('image');

const rateLimit = require('express-rate-limit');

const { requireAuth, requireMediaAuth } = require('../controllers/authController');
const {
  createPost,
  retrievePost,
  votePost,
  deletePost,
  retrievePostFeed,
  retrieveSuggestedPosts,
  retrieveHashtagPosts,
} = require('../controllers/postController');
const eis = require('express-image-server-fixed');
const filters = require('../utils/filters');


const diskStorage = new eis.DiskStorage({
  dest: path.resolve(process.env.MEDIA_STORAGE_PATH),
})
const postLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
});

postRouter.post('/', postLimiter, requireAuth, upload, createPost);
postRouter.post('/:postId/vote', requireAuth, votePost);

postRouter.get('/suggested/:offset', requireAuth, retrieveSuggestedPosts);
postRouter.get('/filters', (req, res) => {
  res.send({ filters });
});
postRouter.get('/:postId', retrievePost);
postRouter.get('/feed/:offset', requireAuth, retrievePostFeed);
postRouter.get('/hashtag/:hashtag/:offset', requireAuth, retrieveHashtagPosts);

postRouter.delete('/:postId', requireAuth, deletePost);
postRouter.get('/image/:id', requireMediaAuth, eis.processMiddleware({
  storage: diskStorage
}))
module.exports = postRouter;
