export const env = {
  CASDOOR_ENDPOINT: 'https://casdoor.lifepower.ai',
  CASDOOR_CLIENT_ID: process.env.NEXT_PUBLIC_CASDOOR_CLIENT_ID || process.env.CASDOOR_CLIENT_ID || '',
  CASDOOR_ORGANIZATION: process.env.NEXT_PUBLIC_CASDOOR_ORGANIZATION || process.env.CASDOOR_ORGANIZATION || '生命能量',
  CASDOOR_APPLICATION: process.env.NEXT_PUBLIC_CASDOOR_APPLICATION || process.env.CASDOOR_APPLICATION || 'mood-bottle',
  CASDOOR_CALLBACK: '/callback',  // 修改为正确的回调路径
} as const;
