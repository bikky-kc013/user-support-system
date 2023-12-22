const multer = require("multer");
const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
  "application/pdf": "pdf",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("Invalid File Type Provided");
    if (isValid == "pdf") {
      uploadError = null;
      cb(uploadError, "public/uploads/pdf");
    } else {
      uploadError = null;
      cb(uploadError, "public/uploads/images");
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

module.exports = { storage };
