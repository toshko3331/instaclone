const express = require('express');
const userRouter = express.Router();
const multer = require('multer');
const path = require('path');
const {
  retrieveUser,
  retrievePosts,
  bookmarkPost,
  followUser,
  retrieveFollowing,
  retrieveFollowers,
  searchUsers,
  confirmUser,
  changeAvatar,
  removeAvatar,
  updateProfile,
  retrieveSuggestedUsers,
} = require('../controllers/userController');
const { requireAuth, optionalAuth } = require('../controllers/authController');

userRouter.get('/suggested/:max?', requireAuth, retrieveSuggestedUsers);
userRouter.get('/:username', optionalAuth, retrieveUser);
userRouter.get('/:username/posts/:offset', retrievePosts);
userRouter.get('/:userId/:offset/following', requireAuth, retrieveFollowing);
userRouter.get('/:userId/:offset/followers', requireAuth, retrieveFollowers);
userRouter.get('/:username/:offset/search', searchUsers);

userRouter.put('/confirm', requireAuth, confirmUser);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(process.env.MEDIA_STORAGE_PATH))
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, (file.originalname.slice(0, 100)  + '-' + uniqueSuffix).replace(/\./g,'-').slice(0,150) 
      + path.extname(file.originalname).slice(0,170))
  }
})

userRouter.put(
  '/avatar',
  requireAuth,
  multer({
    storage: storage,
    limits: { fieldSize: 8 * 8192 * 4320 , fileSize: 20000000 },
  }).single('image'),
  changeAvatar
);
userRouter.put('/', requireAuth, updateProfile);

userRouter.delete('/avatar', requireAuth, removeAvatar);

userRouter.post('/:postId/bookmark', requireAuth, bookmarkPost);
userRouter.post('/:userId/follow', requireAuth, followUser);

module.exports = userRouter;
