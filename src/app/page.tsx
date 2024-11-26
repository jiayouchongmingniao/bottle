'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// 动态导入组件
const UserMenu = dynamic(() => import('@/components/auth/UserMenu').then(mod => mod.UserMenu), {
  loading: () => <div>Loading...</div>,
  ssr: false
});

const ReceiveBottle = dynamic(() => import('@/components/bottle/ReceiveBottle').then(mod => mod.ReceiveBottle), {
  loading: () => <div>Loading bottle display...</div>,
  ssr: false
});

const BottleForm = dynamic(() => import('@/components/bottle/BottleForm').then(mod => mod.BottleForm), {
  loading: () => <div>Loading form...</div>,
  ssr: false
});

export default function Home() {
  return (
    <div>
      <nav className="bg-white shadow">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">
            Mood Bottle
          </h1>
          <Suspense fallback={<div>Loading...</div>}>
            <UserMenu />
          </Suspense>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">
            Mood Bottle
          </h1>
          <p className="text-lg text-gray-600">
            Share your feelings with the world, one bottle at a time
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              捡一个漂流瓶
            </h2>
            <Suspense fallback={<div>Loading bottle display...</div>}>
              <ReceiveBottle />
            </Suspense>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              扔一个漂流瓶
            </h2>
            <Suspense fallback={<div>Loading form...</div>}>
              <BottleForm />
            </Suspense>
          </section>
        </div>
      </main>
    </div>
  );
}
