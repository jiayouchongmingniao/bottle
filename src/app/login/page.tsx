'use client';

import { LoginButton } from '@/components/auth/LoginButton';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-8">登录漂流瓶</h1>
        <div className="space-y-4">
          <LoginButton provider="google" className="w-full" />
          <LoginButton provider="wechat" className="w-full" />
        </div>
      </div>
    </div>
  );
}
