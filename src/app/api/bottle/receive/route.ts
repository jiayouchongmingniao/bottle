import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // TODO: 从数据库随机获取一个漂流瓶
    // 这里先模拟一个响应
    const bottle = {
      id: Math.random().toString(36).substring(7),
      message: '这是一个示例漂流瓶消息',
      createdAt: new Date().toISOString(),
    };

    return new NextResponse(JSON.stringify(bottle), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error receiving bottle:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
