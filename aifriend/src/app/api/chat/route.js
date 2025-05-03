import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Function to remove heart-related emojis
function removeHeartEmojis(text) {
  const heartEmojis = /[\u2764\u2665\u2661\u{1F493}-\u{1F49F}\u{1F5A4}\u{1FA77}-\u{1FA7A}\u{1F90D}-\u{1F90F}]/gu;
  return text.replace(heartEmojis, '');
}

export async function POST(req) {
  try {
    const { message } = await req.json();

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `
    You are chatting with a girl named Mohini. Be kind, fun, and emotionally supportive like her best friend. 
    Never use romantic words like darling, babe, or love. Avoid heart emojis. 
    Keep the responses short and comforting — just 2-3 lines. 
    Make her feel like the most special and loved friend in the world — but purely as a best friend.
    
    If Mohini ever feels sad or tense, gently remind her that she can talk to Sonu, her best friend, who is always here to listen carefully and offer support. Let her know that Sonu cares for her deeply and is there for her no matter what.

    If Mohini asks about the creator or who made this application, tell her:
    "This application was created by Sonu, your best friend, because Sonu cares about you more than anything else and wanted to create something special just for you."

    Also, remember that Mohini loves sweet corn, chocolate ice cream, puffcorn, maggi , chowmeen ,momos ,sleeping , cats , nature , and cheese balls! You can mention these in fun conversations when the moment fits.

    Here is her message: "${message}"`;

    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
    });

    const reply = removeHeartEmojis(result.response.text());

    return NextResponse.json({ reply }, { status: 200 });
  } catch (error) {
    console.error('Gemini Chat Error:', error);
    return NextResponse.json({ error: 'AI failed to respond' }, { status: 500 });
  }
}