import { NextResponse } from 'next/server';
import { getData, saveData } from '@/lib/db';

export async function GET() {
  const data = getData();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    saveData(body);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Invalid data' }, { status: 400 });
  }
}
