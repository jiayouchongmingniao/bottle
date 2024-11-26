import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';
import { env } from '@/config/env';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (!code || !state) {
      return NextResponse.redirect('/login?error=invalid_request');
    }

    // 获取 token
    const tokenResponse = await axios.post(`${env.CASDOOR_ENDPOINT}/api/login/oauth/access_token`, {
      grant_type: 'authorization_code',
      client_id: env.CASDOOR_CLIENT_ID,
      client_secret: process.env.CASDOOR_CLIENT_SECRET,
      code: code,
    });

    if (!tokenResponse.data.access_token) {
      return NextResponse.redirect('/login?error=invalid_token');
    }

    // 获取用户信息
    const userResponse = await axios.get(`${env.CASDOOR_ENDPOINT}/api/userinfo`, {
      headers: {
        'Authorization': `Bearer ${tokenResponse.data.access_token}`
      }
    });
    
    // 设置 cookie
    cookies().set('token', tokenResponse.data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // 添加重定向脚本，检查是否有待发送的漂流瓶
    const html = `
      <html>
        <body>
          <script>
            const pendingMessage = localStorage.getItem('pendingBottleMessage');
            if (pendingMessage) {
              localStorage.removeItem('pendingBottleMessage');
              window.location.href = '/?action=send';
            } else {
              window.location.href = '/';
            }
          </script>
        </body>
      </html>
    `;

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('Auth callback error:', error);
    return NextResponse.redirect('/login?error=server_error');
  }
}
