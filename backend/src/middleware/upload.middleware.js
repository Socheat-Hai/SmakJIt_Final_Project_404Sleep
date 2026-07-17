const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../../uploads');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // FIX: Sanitize extension — only allow known safe extensions
    const ext = path.extname(file.originalname).toLowerCase();
    const safeExts = ['.jpeg', '.jpg', '.png', '.gif', '.webp'];
    const finalExt = safeExts.includes(ext) ? ext : '.png';
    cb(null, unique + finalExt);
  },
});

const fileFilter = (req, file, cb) => {
  // FIX: Removed SVG (XSS risk via embedded JavaScript) and tightened MIME validation
  const allowedExts = /jpeg|jpg|png|gif|webp/;
  const allowedMimes = /^image\/(jpeg|jpg|png|gif|webp)$/;
  const extOk = allowedExts.test(path.extname(file.originalname).toLowerCase().replace('.', ''));
  const mimeOk = allowedMimes.test(file.mimetype);
  if (extOk && mimeOk) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpg, png, gif, webp) are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const docStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const docDir = path.join(uploadDir, 'documents');
    fs.mkdirSync(docDir, { recursive: true });
    cb(null, docDir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, unique + ext);
  },
});

const docFileFilter = (req, file, cb) => {
  const allowedExts = /pdf|doc|docx/;
  const allowedMimes = /^(application\/pdf|application\/msword|application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document)$/;
  const extOk = allowedExts.test(path.extname(file.originalname).toLowerCase().replace('.', ''));
  const mimeOk = allowedMimes.test(file.mimetype);
  if (extOk || mimeOk) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF and Word documents (pdf, doc, docx) are allowed'), false);
  }
};

const docUpload = multer({
  storage: docStorage,
  fileFilter: docFileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

module.exports = upload;
module.exports.docUpload = docUpload;
