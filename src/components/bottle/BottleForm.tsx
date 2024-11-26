'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface BottleFormProps {
  className?: string;
}

export const BottleForm: React.FC<BottleFormProps> = ({ className }) => {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/bottle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error('Failed to send bottle');
      }

      // 清空表单
      setMessage('');
      // 显示成功消息
      alert('漂流瓶已成功发送！');
      
    } catch (error) {
      console.error('Error sending bottle:', error);
      alert('发送失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className || ''}`}>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="写下你想说的话..."
        className="w-full h-32 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        required
      />
      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
      >
        {isLoading ? '发送中...' : '扔出漂流瓶'}
      </button>
    </form>
  );
};
