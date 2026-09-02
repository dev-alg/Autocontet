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
- يكون قصيراً وجذاباً.
- لا يبالغ في الوعود الطبية.
- لا يقدم تشخيصاً طبياً.
- يكون مناسباً لمنشور TikTok.
- يتجنب العبارات المتكررة والمصطنعة.
- لا يبدو وكأنه نص مولد آلياً.
- استخدم تعابير جزائرية مفهومة وطبيعية بدون مبالغة.

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
- premium product photography.
- soft natural lighting.
- high detail.
- vertical composition suitable for TikTok.

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
أنشئ فكرة جديدة ومختلفة قدر الإمكان عن الأفكار السابقة.

المجال:
${topic}

الأسلوب:
${style}

اكتب باللهجة الجزائرية بطريقة طبيعية جداً.
`;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",

          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
        },

        body: JSON.stringify({
          model: "openai/gpt-oss-120b",

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
          ],

          temperature: 0.9,

          max_tokens: 2000
        })
      }
    );

    if (!response.ok) {

      const error = await response.text();

      console.error("Groq API Error:", error);

      return res.status(response.status).json({
        error: "Groq request failed",
        details: error
      });
    }

    const data = await response.json();

    const rawContent =
      data.choices?.[0]?.message?.content;

    if (!rawContent) {
      return res.status(500).json({
        error: "No content returned from AI"
      });
    }

    let content;

    try {
      content = JSON.parse(rawContent);
    } catch (parseError) {

      return res.status(500).json({
        error: "AI returned invalid JSON",
        details: rawContent
      });
    }

    return res.status(200).json(content);

  } catch (error) {

    console.error("Server Error:", error);

    return res.status(500).json({
      error: "Failed to generate content",
      details: error.message
    });
  }
}
