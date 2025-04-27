import multer from "multer";
import path from "path";
import fs from "fs";
import moment from "moment";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log(file);
        if (!fs.existsSync("src/uploads/books")) {
            console.log("inside if");
            fs.mkdirSync("src/uploads/books", { recursive: true });
        }
        cb(null, "src/uploads/books");
    },
    filename: (req, file, cb) => {
        // console.log({ filename: file });
        const filename =
            moment().format("YY-MM-DD-HH-mm-") +
            file.fieldname +
            path.extname(file.originalname);

        console.log("Generated filename:", filename); // Debugging log

        cb(null, filename);
    },
});

const fileFilter = (req, file, cb) => {
    // if (!file.mimetype.startsWith("image/")) {
    //     return cb(new Error("Only images are allowed"), false);
    // }
    cb(null, true);
};

// const storage = multer.memoryStorage(); //store files in memory buffers

// Multer instance
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB file size limit
});

export default upload;
