import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  // 检查认证
  const token = cookies().get('token');
  if (!token) {
    return new NextResponse(null, { status: 401 });
  }

  try {
    const body = await request.json();
    const { message } = body;

    if (!message) {
      return new NextResponse(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // TODO: 在这里添加保存漂流瓶到数据库的逻辑

    return new NextResponse(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error processing bottle:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
