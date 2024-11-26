'use client';

import React, { useState } from 'react';

interface Bottle {
  id: string;
  message: string;
  createdAt: string;
}

interface ReceiveBottleProps {
  className?: string;
}

export const ReceiveBottle: React.FC<ReceiveBottleProps> = ({ className }) => {
  const [bottle, setBottle] = useState<Bottle | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReceive = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/bottle/receive');
      if (!response.ok) {
        throw new Error('Failed to receive bottle');
      }

      const data = await response.json();
      setBottle(data);
    } catch (err) {
      console.error('Error receiving bottle:', err);
      setError('抱歉，捡漂流瓶失败了，请稍后再试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`space-y-4 ${className || ''}`}>
      {!bottle ? (
        <button
          onClick={handleReceive}
          disabled={isLoading}
          className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isLoading ? '正在捡漂流瓶...' : '捡一个漂流瓶'}
        </button>
      ) : (
        <div className="p-4 bg-white rounded-lg shadow">
          <p className="mb-4 text-gray-700">{bottle.message}</p>
          <div className="text-sm text-gray-500">
            收到时间：{new Date(bottle.createdAt).toLocaleString()}
          </div>
          <button
            onClick={() => setBottle(null)}
            className="mt-4 px-4 py-2 text-blue-500 border border-blue-500 rounded-lg hover:bg-blue-50"
          >
            再捡一个
          </button>
        </div>
      )}
      
      {error && (
        <div className="p-4 text-red-500 bg-red-50 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
};
