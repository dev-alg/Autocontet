export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const {
      topic = "both",
      style = "natural"
    } = req.body || {};

    const systemPrompt = `
أنت كاتب محتوى جزائري محترف متخصص في نصائح العناية بالبشرة والشعر.

اكتب محتوى طبيعي باللهجة الجزائرية.

المحتوى يجب أن:
- يبدو مكتوباً بطريقة بشرية وطبيعية.
- يكون مفيداً وعملياً.
- لا يبالغ في الوعود الطبية.
- لا يقدم تشخيصاً طبياً.
- يكون مناسباً لمنشور TikTok.
- يكون قصيراً وجذاباً.
- يتجنب العبارات المتكررة والمصطنعة.

المواضيع المسموحة:
العناية بالبشرة والعناية بالشعر.

أعد النتيجة بصيغة JSON فقط بالشكل التالي:

{
  "title": "",
  "topic": "",
  "idea": "",
  "caption": "",
  "hashtags": [],
  "imagePrompt": ""
}

بالنسبة لـ imagePrompt:

أنشئ وصفاً باللغة الإنجليزية لصورة عالية الجودة.

الصورة يجب أن تحتوي على:
- منتجات أو أدوات أو مكونات للعناية بالبشرة أو الشعر.
- ترتيب جميل واحترافي.
- still life photography.

ولا يجب أن تحتوي أبداً على:
- humans
- people
- faces
- hands
- animals
- characters
- living beings
- body parts
`;

    const userPrompt = `
أنشئ فكرة جديدة وغير مكررة.

المجال:
${topic}

الأسلوب:
${style}
`;

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4.1-mini",
          response_format: {
            type: "json_object"
          },
          messages: [
            {
              role: "system",
              content: systemPrompt
            },
            {
              role: "user",
              content: userPrompt
            }
          ]
        })
      }
    );

    if (!response.ok) {
      const error = await response.text();

      return res.status(500).json({
        error: "OpenAI request failed",
        details: error
      });
    }

    const data = await response.json();

    const content = JSON.parse(
      data.choices[0].message.content
    );

    return res.status(200).json(content);

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error: "Failed to generate content"
    });

  }
}
