import { createExpense, getExpenses } from '../models/expenseModel.js';
import s3 from '../config/aws.js';
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() }).single('receipt');

export const addExpense = [
  upload,
  async (req, res) => {
    try {
      const file = req.file;
      const fileKey = `receipts/${uuidv4()}-${file.originalname}`;
      
      await s3.upload({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
      }).promise();

      const data = {
        ...req.body,
        receipt: `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${fileKey}`,
      };
      const expense = await createExpense(data);
      res.status(201).json(expense);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
];

export const getAllExpenses = async (req, res) => {
  try {
    const expenses = await getExpenses(req.query.user_id);
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
