
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set in Supabase secrets.')
    }

    const { prompt: itemPrompt } = await req.json()

    if (!itemPrompt) {
      return new Response(
        JSON.stringify({ error: "Missing required field: prompt is required" }), 
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    const fullPrompt = `${itemPrompt}, clothing item, high quality, photorealistic, on a transparent background, for virtual try-on, fashion photography, clean edges`

    console.log("Generating image with OpenAI using prompt:", fullPrompt)
    
    const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'gpt-image-1',
            prompt: fullPrompt,
            n: 1,
            size: '1024x1024',
            output_format: 'png',
            background: 'transparent',
            quality: 'high',
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error(`OpenAI Image Generation API error: ${response.status}`, errorText);
        throw new Error(`OpenAI Image Generation API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const base64 = data.data[0].b64_json;
    const dataUrl = `data:image/png;base64,${base64}`;


    return new Response(JSON.stringify({ imageUrl: dataUrl }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error("Error in generate-clothing-image function:", error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
