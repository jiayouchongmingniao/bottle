'use client';

import React from 'react';
import { env } from '@/config/env';

interface UserMenuProps {
  className?: string;
}

export const UserMenu: React.FC<UserMenuProps> = ({ className }) => {
  const handleLogin = () => {
    const state = Math.random().toString(36).substring(7);
    const authUrl = `${env.CASDOOR_ENDPOINT}/login/oauth/authorize?` + new URLSearchParams({
      client_id: env.CASDOOR_CLIENT_ID,
      response_type: 'code',
      redirect_uri: `${window.location.origin}${env.CASDOOR_CALLBACK}`,
      scope: 'read',
      state: state,
      provider: 'google'
    }).toString();

    window.location.href = authUrl;
  };

  return (
    <div className={`flex items-center gap-4 ${className || ''}`}>
      <button
        onClick={handleLogin}
        className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 flex items-center gap-2"
      >
        <img
          src="https://www.google.com/favicon.ico"
          alt="Google"
          className="w-5 h-5"
        />
        登录
      </button>
    </div>
  );
};
