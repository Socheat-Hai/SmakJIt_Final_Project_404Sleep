const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
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

module.exports = upload;
