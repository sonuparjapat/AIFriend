import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Function to remove heart-related emojis
function removeHeartEmojis(text) {
  const heartEmojis = /[\u2764\u2665\u2661\u{1F493}-\u{1F49F}\u{1F5A4}\u{1FA77}-\u{1FA7A}\u{1F90D}-\u{1F90F}]/gu;
  return text.replace(heartEmojis, '');
}

export async function GET(req) {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
    });

    const prompt = `
    Give a sweet, emotional, and uplifting compliment to a girl named Mohini. 
    Talk to her like her best friend who truly cares about her. 
    Make her feel like the most unique and special person in the world. 
    Avoid romantic words like darling, babe, or love, and do not use any heart emojis. 
    Use gentle, expressive emojis. Keep the compliment short — just 2-3 lovely lines.
    Keep the tone warm, supportive, and friendly — like a true best friend who is always there for her. 
`;

    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
    });

    // Remove heart emojis before sending
    const text = removeHeartEmojis(result.response.text());

    return NextResponse.json({ compliment: text }, { status: 200 });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return NextResponse.json({ error: 'Failed to get AI response' }, { status: 500 });
  }
}