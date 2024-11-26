'use client';

import { useState, useEffect, useRef } from 'react';
import { Bottle, SupportedLanguage } from '@/types';
import { io, Socket } from 'socket.io-client';
import { format } from 'date-fns';
import dynamic from 'next/dynamic';

const BottleDisplay = () => {
  const [bottle, setBottle] = useState<Bottle | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('en');
  const [showBottle, setShowBottle] = useState(false);
  const bottleRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const socket = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3000');

    socket.on('receive_bottle', (newBottle: Bottle) => {
      setBottle(newBottle);
      setTimeout(() => setShowBottle(true), 100);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (bottle && bottleRef.current && contentRef.current) {
      bottleRef.current.classList.add('show');
      contentRef.current.classList.add('show');
    }
  }, [showBottle]);

  const fetchRandomBottle = async () => {
    try {
      setLoading(true);
      setShowBottle(false);
      if (bottleRef.current) {
        bottleRef.current.classList.remove('show');
      }
      if (contentRef.current) {
        contentRef.current.classList.remove('show');
      }
      
      const response = await fetch('/api/bottles');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch bottle: ${response.status}`);
      }
      
      const data = await response.json();
      setBottle(data);
      setTimeout(() => setShowBottle(true), 100);
    } catch (error) {
      console.error('Error fetching bottle:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <button
        onClick={fetchRandomBottle}
        disabled={loading}
        className="btn btn-primary w-full text-lg font-semibold"
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Opening bottle...
          </span>
        ) : (
          'Receive a Bottle'
        )}
      </button>

      <div className="bottle-container">
        {bottle && mounted && (
          <div ref={bottleRef} className="bottle-card">
            <div className="card bottle-float">
              <div ref={contentRef} className="bottle-content">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      From {bottle.country}
                    </p>
                    <p className="text-xs text-gray-400">
                      {format(new Date(bottle.timestamp), 'PPp')}
                    </p>
                  </div>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value as SupportedLanguage)}
                    className="text-sm border rounded-md px-2 py-1 bg-white/80 backdrop-blur-sm"
                  >
                    <option value="en">English</option>
                    <option value="zh">Chinese</option>
                    <option value="ar">Arabic</option>
                    <option value="bo">Tibetan</option>
                    <option value="ja">Japanese</option>
                    <option value="ko">Korean</option>
                    <option value="de">German</option>
                    <option value="fr">French</option>
                    <option value="es">Spanish</option>
                    <option value="ru">Russian</option>
                    <option value="it">Italian</option>
                  </select>
                </div>

                <p className="text-lg font-medium mb-4 leading-relaxed">
                  {bottle.translations[selectedLanguage]}
                </p>

                <div className="text-sm text-gray-500 flex items-center">
                  <span className="text-2xl mr-2">
                    {bottle.mood === 'positive' && '😊'}
                    {bottle.mood === 'neutral' && '😐'}
                    {bottle.mood === 'encouraging' && '💪'}
                  </span>
                  <span className="capitalize">{bottle.mood}</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="ocean-wave">
          <div className="wave wave1"></div>
          <div className="wave wave2"></div>
          <div className="wave wave3"></div>
          <div className="wave wave4"></div>
          <div className="wave-glow"></div>
        </div>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(BottleDisplay), {
  ssr: false
});
