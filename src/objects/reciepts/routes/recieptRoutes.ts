import express from 'express';
import multer from "multer";
import getRecieptSummary from '../controllers/getRecieptSummary';
import isLogin from '../../middlewares/isCustomerLogin';
import saveRecieptSummary from '../controllers/saveRecieptSummary';
import getReciepts from '../controllers/getReciepts';

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/getRecieptSummary", isLogin, upload.single("image"), getRecieptSummary);
router.post("/saveRecieptSummary", isLogin, saveRecieptSummary);
router.get("/memeber/getReciepts",isLogin,getReciepts);


export default router;