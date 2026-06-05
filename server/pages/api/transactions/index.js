import connectDB from '../../../lib/mongodb';
import Transaction from '../../../models/Transaction';
import { authenticateToken } from '../../../middleware/auth';

export default async function handler(req, res) {
  try {
    await connectDB();
    const user = await authenticateToken(req);

    switch (req.method) {
      case 'GET':
        const transactions = await Transaction.find({ user: user._id })
          .sort({ date: -1 });
        res.status(200).json({ success: true, data: transactions });
        break;

      case 'POST':
        const transaction = await Transaction.create({
          ...req.body,
          user: user._id,
        });
        res.status(201).json({ success: true, data: transaction });
        break;

      default:
        res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Transaction error:', error);
    res.status(error.message === 'Authentication failed' ? 401 : 500)
       .json({ message: error.message || 'Internal server error' });
  }
}