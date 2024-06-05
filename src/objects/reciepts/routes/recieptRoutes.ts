import express from 'express';
import multer from "multer";
import uploadToS3 from '../controllers/uploadToS3';
import isLogin from '../../middlewares/isCustomerLogin';

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload",isLogin, upload.single("image"),uploadToS3);


export default router;