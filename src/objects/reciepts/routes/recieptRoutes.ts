import express from 'express';
import multer from "multer";
import getRecieptSummary from '../controllers/getRecieptSummary';
import isLogin from '../../middlewares/isCustomerLogin';
import saveRecieptSummary from '../controllers/saveRecieptSummary';
import getReciepts from '../controllers/getReciepts';
import getReciept from '../controllers/getReciept';
import updateRecieptSummary from '../controllers/updateRecieptSummary';
import deleteRecieptSummary from '../controllers/deleteRecieptSummary';

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.get("/member/getReciept/:id", isLogin, getReciept);
router.post("/saveRecieptSummary", isLogin, saveRecieptSummary);
router.get("/member/getReciepts", isLogin, getReciepts);
router.post("/member/updateReciept", isLogin, updateRecieptSummary);
router.post("/member/deleteReciept", isLogin, deleteRecieptSummary);
router.post("/getRecieptSummary", isLogin, upload.single("image"), getRecieptSummary);


export default router;