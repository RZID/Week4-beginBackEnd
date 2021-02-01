const multer = require('multer')
const path = require('path')
const responser = require('../helperResponse')
const limiterSize = 3 // Megabyte units!

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/imageProduct')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${path.extname(file.originalname)}`)
    }
})

const multerUpload = multer({
    storage: multerStorage,
    limits: {
        fileSize: limiterSize * 1024 * 1024 // MegaByte(s)
    },
    fileFilter: (req, file, cb) => {
        const extension = path.extname(file.originalname)
        if ((/\.(jpe?g|png)$/i).test(extension)) {
            cb(null, true)
        } else {
            cb({
                message: 'File extension not allowed! [Please upload like: jpeg/jpg/png]',
                code: 'notMatchType'
            }, false)
        }
    }
})

const singleUpload = (req, res, next) => {
    const multerSingle = multerUpload.single('productImage')
    if (multerSingle) {
        multerSingle(req, res, (err) => {
            if (err) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return responser.tooLarge(res, `The file size is too large, please enter the file under ${limiterSize}MB`)
                } else if (err.code === 'notMatchType') {
                    return responser.notAccept(res, err.message)
                } else {
                    return responser.internalError(res, err)
                }
            } else {
                next()
            }
        })
    } else {
        next()
    }
}
module.exports = { singleUpload }