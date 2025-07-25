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
      // Zachowaj polskie znaki - usuń tylko niebezpieczne znaki systemu plików
      const originalName = Buffer.from(file.originalname, 'latin1').toString('utf8');
      const extension = path.extname(originalName);
      const nameWithoutExt = path.basename(originalName, extension);
      
      // Usuń tylko niebezpieczne znaki, zachowaj polskie litery
      const safeName = nameWithoutExt
        .replace(/[<>:"/\\|?*]/g, '_') // Usuń niebezpieczne znaki systemu plików
        .replace(/\s+/g, '_') // Zamień spacje na podkreślenia
        .trim();
      
      const timestamp = Date.now();
      const finalName = `${timestamp}-${safeName}${extension}`;
      
      cb(null, finalName);
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