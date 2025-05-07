
import { NextResponse } from 'next/server';
import {username} from "../../utils/username"
export async function POST(req) {
  try {
    const { name } = await req.json(); // Get the name from the user

    if (name.trim().toLowerCase() === `${username.toLowerCase()}`) {
      return NextResponse.json({ [`is${username}`]: true }, { status: 200 });
    } else {
      return NextResponse.json({ [`is${username}`]: false }, { status: 200 });
    }
  } catch (error) {
    console.error('Error checking name:', error);
    return NextResponse.json({ error: 'Something went wrong!' }, { status: 500 });
  }
}