'use client';

import { useState } from 'react';
import { PresetMood } from '@/types';
import { io } from 'socket.io-client';

export default function BottleForm() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [presetMoods, setPresetMoods] = useState<PresetMood[]>([]);

  const fetchPresetMoods = async () => {
    try {
      const response = await fetch('/api/moods');
      if (!response.ok) {
        throw new Error('Failed to fetch preset moods');
      }
      const data = await response.json();
      setPresetMoods(data);
      setShowPresets(true);
    } catch (error) {
      console.error('Error fetching preset moods:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) return;
    
    try {
      setLoading(true);
      const response = await fetch('/api/bottles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send bottle');
      }
      
      // Connect to WebSocket and emit the new bottle
      const socket = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3000');
      socket.emit('send_bottle', await response.json());
      socket.disconnect();
      
      setContent('');
      alert('Your message has been sent in a bottle!');
    } catch (error) {
      console.error('Error sending bottle:', error);
      alert('Failed to send your message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectPresetMood = (mood: PresetMood) => {
    setContent(mood.content.en); // Use English content as default
    setShowPresets(false);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="content" className="label">
            Your Message
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="input h-32 resize-none"
            placeholder="Share your feelings..."
            required
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary flex-1"
          >
            {loading ? 'Sending...' : 'Send Bottle'}
          </button>
          
          <button
            type="button"
            onClick={fetchPresetMoods}
            className="btn btn-secondary"
          >
            Random Mood
          </button>
        </div>
      </form>

      {showPresets && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-xl font-semibold">
              Choose a Mood
            </h3>
            
            <div className="space-y-2">
              {presetMoods.map((mood) => (
                <button
                  key={mood.id}
                  onClick={() => selectPresetMood(mood)}
                  className="card w-full text-left hover:bg-gray-50"
                >
                  <p className="font-medium">{mood.content.en}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {mood.type === 'positive' && '😊'}
                    {mood.type === 'neutral' && '😐'}
                    {mood.type === 'encouraging' && '💪'}
                    <span className="ml-2">{mood.type}</span>
                  </p>
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setShowPresets(false)}
              className="btn btn-secondary w-full"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
