const fs = require('fs');
const path = require('path');
const multer = require('multer');

const ALLOWED_IMAGE_MIME_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];

const IsWrongImageMimeType = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'Plik jest za duży!' });
    }
  } else if (error && error.message) {
    return res.status(400).json({ error: error.message });
  }
  next();
};

const removeTaskImage = (imageFileName) => {
  if (!imageFileName) return;
  const imagePath = path.join(__dirname, '../../public/uploads/tasks/', imageFileName);
  fs.unlinkSync(imagePath);
}

const createImageUpload = () => {
  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, path.join(__dirname, '../../public/uploads/tasks')),
    filename: (_req, file, cb) => {
      const safeName = file.originalname.normalize('NFD').replace(/[^ -\w.\-]/g, '_');
      cb(null, Date.now() + '-' + safeName);
    }
  });

  const fileFilter = (_req, file, cb) => {
    if (ALLOWED_IMAGE_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Dozwolone są tylko pliki PNG, JPG i JPEG!'), false);
    }
  };

  return multer({ storage, fileFilter });
};

module.exports = { removeTaskImage, createImageUpload, IsWrongImageMimeType }; 