const multer = require('multer')
const sharp = require('sharp')
const AppError = require('../../error/appError')
const catchAsync = require('../../utils/catchAsync')

const multerStorage = multer.memoryStorage()

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true)
  } else {
    cb(new AppError("It's not a photo! Upload photo only.", 400), false)
  }
}

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
})

const uploadUserPhoto = upload.fields([
  { name: 'photo', maxCount: 1 }
])

const resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (req.files) {
    req.body.photo = `user-${req.params.id}-${Date.now()}-photo.jpeg`

    await sharp(req.files.photo[0].buffer)
      // .resize(500, 500)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`storage/img/users/${req.body.photo}`)
  }
  next()
})

module.exports = {
  uploadUserPhoto,
  resizeUserPhoto
}
