'use client';

import React from 'react';
import { env } from '@/config/env';

interface LoginButtonProps {
  provider: 'google' | 'wechat';
  className?: string;
}

export const LoginButton: React.FC<LoginButtonProps> = ({ provider, className }) => {
  const handleLogin = () => {
    const state = Math.random().toString(36).substring(7);
    const authUrl = `${env.CASDOOR_ENDPOINT}/login/oauth/authorize?` + new URLSearchParams({
      client_id: env.CASDOOR_CLIENT_ID,
      response_type: 'code',
      redirect_uri: `${window.location.origin}${env.CASDOOR_CALLBACK}`,
      scope: 'read',
      state: state,
      provider: provider
    }).toString();

    window.location.href = authUrl;
  };

  return (
    <button
      onClick={handleLogin}
      className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
        provider === 'google'
          ? 'bg-white text-gray-800 border border-gray-300'
          : 'bg-[#07C160] text-white'
      } ${className || ''}`}
    >
      {provider === 'google' ? (
        <>
          <img
            src="https://www.google.com/favicon.ico"
            alt="Google"
            className="w-5 h-5"
          />
          Sign in with Google
        </>
      ) : (
        <>
          <img
            src="https://res.wx.qq.com/a/wx_fed/assets/res/NTI4MWU5.ico"
            alt="WeChat"
            className="w-5 h-5"
          />
          微信登录
        </>
      )}
    </button>
  );
};
