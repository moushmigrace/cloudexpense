import { createExpense, getExpenses, deleteExpenseById } from '../models/expenseModel.js';
import s3 from '../config/aws.js';
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';


const upload = multer({ storage: multer.memoryStorage() }).single('receipt');

export const addExpense = [
  upload,
  async (req, res) => {
    try {
      if (!req.user?.user_id) return res.status(401).json({ error: 'User not authenticated' });

      let receiptUrl = null;
      if (req.file) {
        const file = req.file;
        const fileKey = `receipts/${uuidv4()}-${file.originalname}`;
        await s3.upload({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: fileKey,
          Body: file.buffer,
          ContentType: file.mimetype,
          ACL: 'public-read'
        }).promise();
        receiptUrl = `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${fileKey}`;
      }

      const data = { ...req.body, receipt: receiptUrl, user_id: req.user.user_id };
      const expense = await createExpense(data);
      res.status(201).json(expense);
    } catch (err) {
      console.error('[addExpense] ERROR:', err);
      res.status(500).json({ error: err.message });
    }
  },
];

export const getAllExpenses = async (req, res) => {
  try {
    if (!req.user?.user_id) return res.status(401).json({ error: 'User not authenticated' });

    const user_id = req.user.user_id;
    const filters = {
      category: req.query.category || null,
      vendor: req.query.vendor || null,
      minAmount: req.query.minAmount || null,
      maxAmount: req.query.maxAmount || null,
      startDate: req.query.startDate || null,
      endDate: req.query.endDate || null,
    };

    const expenses = await getExpenses(user_id, filters);
    res.json(expenses);
  } catch (err) {
    console.error('[getAllExpenses] ERROR:', err);
    res.status(500).json({ error: err.message });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    if (!req.user?.user_id) return res.status(401).json({ error: 'User not authenticated' });
    const expenseId = req.params.id;

    await deleteExpenseById(expenseId, req.user.user_id);
    res.json({ message: 'Expense deleted successfully' });
  } catch (err) {
    console.error('[deleteExpense] ERROR:', err);
    res.status(500).json({ error: err.message });
  }
};
