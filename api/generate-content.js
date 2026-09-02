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

اكتب دائماً باللهجة الجزائرية الطبيعية، وكأن شخصاً جزائرياً حقيقياً هو الذي كتب المحتوى.

المحتوى يكون:
- طبيعي وغير متكلف.
- باللهجة الجزائرية.
- مفيد وعملي.
- مناسب لمنشور TikTok.
- قصير وجذاب.
- غير مكرر.
- بدون ادعاءات طبية مبالغ فيها.
- بدون تشخيصات طبية.

المواضيع المسموحة:
- العناية بالبشرة.
- العناية بالشعر.

أعد النتيجة بصيغة JSON فقط وبدون أي كلام إضافي:

{
  "title": "",
  "topic": "",
  "idea": "",
  "caption": "",
  "hashtags": [],
  "imagePrompt": ""
}

مهم جداً بالنسبة لـ imagePrompt:
اكتبه باللغة الإنجليزية.

الصورة يجب أن تكون still life photography فقط.

يجب أن تحتوي على منتجات أو أدوات أو مكونات خاصة بالعناية بالبشرة أو الشعر.

ممنوع تماماً:
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
أنشئ محتوى جديداً وغير مكرر.

المجال المطلوب:
${topic}

الأسلوب المطلوب:
${style}

اجعل كل النصوص العربية باللهجة الجزائرية.
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
          max_tokens: 1500,
          response_format: {
            type: "json_object"
          }
        })
      }
    );

    const responseText = await response.text();

    if (!response.ok) {
      console.error("Groq API error:", responseText);

      return res.status(response.status).json({
        error: "Groq request failed",
        details: responseText
      });
    }

    const data = JSON.parse(responseText);

    const messageContent =
      data?.choices?.[0]?.message?.content;

    if (!messageContent) {
      return res.status(500).json({
        error: "No content returned from Groq"
      });
    }

    let content;

    try {
      content = JSON.parse(messageContent);
    } catch (parseError) {
      console.error(
        "JSON parsing error:",
        messageContent
      );

      return res.status(500).json({
        error: "Invalid JSON returned by model",
        details: messageContent
      });
    }

    return res.status(200).json(content);

  } catch (error) {

    console.error("Server error:", error);

    return res.status(500).json({
      error: "Server error",
      details: error.message
    });

  }
}- العبارات المكررة
- المبالغة
- الوعود الطبية
- التشخيص الطبي
- الكلمات التي تكشف أن المحتوى مولد بالذكاء الاصطناعي

أمثلة على أسلوب مناسب:

"ديري بالك من..."
"ما تكثريش من..."
"إذا بشرتك تتحسس..."
"جربي تديري..."
"خلي روتينك بسيط..."
"ماشي لازم..."

المحتوى يجب أن يكون:

- قصيراً
- مفيداً
- طبيعياً
- جذاباً
- مناسباً لـ TikTok
- باللهجة الجزائرية

أنشئ فكرة جديدة قدر الإمكان.

أعد النتيجة بصيغة JSON فقط.

استخدم هذا الشكل بالضبط:

{
  "title": "",
  "topic": "",
  "idea": "",
  "caption": "",
  "hashtags": [],
  "imagePrompt": ""
}

قواعد الحقول:

title:
عنوان قصير وجذاب باللهجة الجزائرية.

topic:
بالعربية أو باللهجة الجزائرية.

idea:
النصيحة أو فكرة المحتوى باللهجة الجزائرية.

caption:
Caption طبيعي باللهجة الجزائرية.

hashtags:
مجموعة Hashtags مناسبة للمحتوى والجمهور الجزائري.

imagePrompt:

هذا الحقل فقط يكون باللغة الإنجليزية لأنه مخصص لمولد الصور.

يجب أن يصف صورة احترافية جداً بنسبة عمودية 9:16.

الصورة يجب أن تكون Still Life Photography فقط.

يمكن أن تحتوي على:

- skincare products
- haircare products
- cosmetic bottles
- jars
- natural ingredients
- towels
- combs
- brushes
- oils
- creams
- serum bottles

ممنوع تماماً:

- humans
- people
- person
- faces
- hands
- body parts
- animals
- characters
- living beings
- human silhouettes

اجعل الصورة:

premium
professional
high quality
photorealistic
clean composition
soft natural lighting
vertical 9:16
TikTok optimized
`;

    const userPrompt = `
أنشئ منشوراً جديداً الآن.

المجال المطلوب:
${topic}

الأسلوب البصري:
${style}

ركز على نصيحة عملية ومفيدة.

اجعل النصوص العربية باللهجة الجزائرية الطبيعية.
لا تكرر فكرة عامة مثل المنشورات التقليدية.
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

          temperature: 0.95,

          max_tokens: 2000
        })
      }
    );

    if (!response.ok) {
      const error = await response.text();

      console.error("Groq API Error:", error);

      return res.status(response.status).json({
        error: "تعذر إنشاء المحتوى",
        details: error
      });
    }

    const data = await response.json();

    const rawContent =
      data.choices?.[0]?.message?.content;

    if (!rawContent) {
      return res.status(500).json({
        error: "ما رجع حتى محتوى من الذكاء الاصطناعي"
      });
    }

    let content;

    try {
      content = JSON.parse(rawContent);
    } catch (error) {
      return res.status(500).json({
        error: "المحتوى رجع بصيغة غير صحيحة",
        details: rawContent
      });
    }

    /*
      إنشاء رابط الصورة.

      نضيف تعليمات إضافية لضمان
      عدم وجود بشر أو ذوات أرواح.
    */

    const safeImagePrompt = `
${content.imagePrompt},

still life photography only,
no humans,
no people,
no faces,
no hands,
no body parts,
no animals,
no characters,
no living beings,

premium commercial product photography,
photorealistic,
high detail,
clean composition,
soft natural lighting,
vertical composition,
9:16 aspect ratio
`;

    const imageUrl =
      `https://image.pollinations.ai/prompt/${encodeURIComponent(
        safeImagePrompt
      )}?width=768&height=1344&nologo=true`;

    return res.status(200).json({
      ...content,

      imagePrompt: safeImagePrompt,

      imageUrl: imageUrl,

      generatedAt: new Date().toISOString()
    });

  } catch (error) {

    console.error("Server Error:", error);

    return res.status(500).json({
      error: "صار مشكل أثناء إنشاء المحتوى",
      details: error.message
    });
  }
}  "topic": "",
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
