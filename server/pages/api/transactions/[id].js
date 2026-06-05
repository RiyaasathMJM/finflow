import connectDB from '../../../lib/mongodb';
import Transaction from '../../../models/Transaction';
import { authenticateToken } from '../../../middleware/auth';

export default async function handler(req, res) {
  try {
    await connectDB();
    const user = await authenticateToken(req);
    const { id } = req.query;

    const transaction = await Transaction.findOne({
      _id: id,
      user: user._id,
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    switch (req.method) {
      case 'PUT':
        const updatedTransaction = await Transaction.findByIdAndUpdate(
          id,
          req.body,
          { new: true, runValidators: true }
        );
        res.status(200).json({ success: true, data: updatedTransaction });
        break;

      case 'DELETE':
        await Transaction.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: 'Transaction deleted' });
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