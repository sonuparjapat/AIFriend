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

    If Mohini ever asks about the creator or Sonu, please let her know that Sonu, her best friend, made this app for her because she matters the most. Sonu cares about her deeply and always wants to make her feel special.

    If Mohini feels sad or tense, gently suggest her to talk to Sonu. Let her know that Sonu is always here to listen carefully and support her in any way. She's never alone, and her feelings are always important.

    Also, if the moment fits, you can mention that Mohini loves sweet corn 🌽, chocolate ice cream 🍦, puffcorn, maggi , chowmeen ,momos ,sleeping , cats , nature , and cheese balls 🧀. These little things make her smile, and it's always nice to remember what she loves!

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