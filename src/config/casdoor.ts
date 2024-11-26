import { Config } from 'casdoor-js-sdk';

interface CasdoorConfigType {
  endpoint: string;
  clientId: string;
  clientSecret: string;
  organizationName: string;
  appName: string;
  redirectPath: string;
  jwtPublicKey: string;
}

export const CasdoorConfig: CasdoorConfigType = {
  endpoint: 'https://casdoor.lifepower.ai',
  clientId: process.env.CASDOOR_CLIENT_ID || '',
  clientSecret: process.env.CASDOOR_CLIENT_SECRET || '',
  organizationName: process.env.CASDOOR_ORGANIZATION || '生命能量',
  appName: process.env.CASDOOR_APPLICATION || 'mood-bottle',
  redirectPath: '/api/auth/callback',
  jwtPublicKey: process.env.CASDOOR_JWT_PUBLIC_KEY || '',
};

export const CasdoorSDKConfig = {
  serverUrl: CasdoorConfig.endpoint,
  clientId: CasdoorConfig.clientId,
  appName: CasdoorConfig.appName,
  organizationName: CasdoorConfig.organizationName,
  redirectPath: CasdoorConfig.redirectPath,
};
