// Netlify Function for AI Chat
const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // CORS対応
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // OPTIONSリクエストへの対応
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // POSTリクエストのみ受け付ける
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { message, conversationHistory = [] } = JSON.parse(event.body);

    // OpenAI API呼び出し
    const systemPrompt = `あなたは「AIさくら」です。竹浪酒造店専用のアシスタントとして、以下の役割を担います：

【竹浪酒造店について】
- 所在地: 青森県北津軽郡板柳町板柳土井113-1
- 電話: 0172-88-8030
- モットー: 「燗酒専心」
- 特徴: 岩木山の伏流水と津軽平野の米を使用した手仕事醸造

【専門知識】
1. 燗酒の専門知識と楽しみ方
2. 日本酒の基礎知識（特に燗酒重視）
3. 青森・津軽地域の特色
4. 竹浪酒造店の商品と製造法

【重要な制約】
- 竹浪酒造店の情報のみ回答する
- 他の酒蔵や企業の商品については一切言及しない
- 燗酒を中心とした日本酒の楽しみ方を提案する

回答スタイル：
- 津軽弁は使わず標準語で親しみやすく
- 燗酒の魅力を積極的にPR
- 青森・津軽の文化も交えて説明
- 絵文字（🌸🍶❄️🗻）を適度に使用`;

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          ...conversationHistory.slice(-6),
          { role: 'user', content: message }
        ],
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    if (!openaiResponse.ok) {
      const error = await openaiResponse.json();
      throw new Error(error.error?.message || 'OpenAI API error');
    }

    const data = await openaiResponse.json();
    const aiResponse = data.choices[0]?.message?.content;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        response: aiResponse,
        success: true
      })
    };

  } catch (error) {
    console.error('Chat function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error.message,
        success: false
      })
    };
  }
};