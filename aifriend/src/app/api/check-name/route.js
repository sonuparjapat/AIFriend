import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { name } = await req.json(); // Get the name from the user

    if (name.trim().toLowerCase() === 'mohini') {
      return NextResponse.json({ isMohini: true }, { status: 200 });
    } else {
      return NextResponse.json({ isMohini: false }, { status: 200 });
    }
  } catch (error) {
    console.error('Error checking name:', error);
    return NextResponse.json({ error: 'Something went wrong!' }, { status: 500 });
  }
}