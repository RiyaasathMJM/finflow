import { useState } from 'react';
import { transactionAPI } from '../../services/api';
import TransactionForm from './TransactionForm';
import toast from 'react-hot-toast';

export default function TransactionList({ transactions, onUpdate }) {
  const [editingId, setEditingId] = useState(null);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await transactionAPI.delete(id);
        toast.success('Transaction deleted!');
        onUpdate();
      } catch (error) {
        toast.error('Failed to delete transaction');
      }
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">💰</div>
        <p className="text-gray-500 text-lg">No transactions yet</p>
        <p className="text-gray-400 text-sm">Add your first transaction to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <div key={transaction._id}>
          {editingId === transaction._id ? (
            <TransactionForm
              editData={transaction}
              onSuccess={() => {
                setEditingId(null);
                onUpdate();
              }}
            />
          ) : (
            <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition duration-200">
              <div className="flex items-center space-x-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                    transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                  }`}
                >
                  {transaction.type === 'income' ? '📥' : '📤'}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">{transaction.category}</h4>
                  <p className="text-sm text-gray-500">
                    {new Date(transaction.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                    {transaction.description && ` • ${transaction.description}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span
                  className={`font-bold text-lg ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                </span>
                <div className="flex space-x-1">
                  <button
                    onClick={() => setEditingId(transaction._id)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition duration-200"
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(transaction._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition duration-200"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}