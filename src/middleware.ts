import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import axios from 'axios';
import { CasdoorConfig } from './config/casdoor';

// 不需要登录的路由
const publicPaths = ['/login', '/api/auth/callback'];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // 如果是公开路由，直接放行
  if (publicPaths.some(publicPath => path.startsWith(publicPath))) {
    return NextResponse.next();
  }

  // 获取 token
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // 验证 token
    const response = await axios.get(`${CasdoorConfig.endpoint}/api/verify-token`, {
      params: {
        token,
        clientId: CasdoorConfig.clientId,
        clientSecret: CasdoorConfig.clientSecret,
      }
    });

    if (response.data.status === 'ok') {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  } catch (error) {
    // token 无效，重定向到登录页
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    /*
     * 匹配所有路径除了:
     * /api/auth/callback (OAuth 回调)
     * /login (登录页)
     * /_next (Next.js 静态文件)
     * /static (静态资源)
     */
    '/((?!api/auth/callback|login|_next|static|.*\\..*).*)',
  ],
};
