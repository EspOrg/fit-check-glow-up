
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function buildStyleAnalysisPrompt(aesthetic: string): string {
    return `You are an expert fashion stylist specializing in ${aesthetic} aesthetic. Analyze outfits based on these specific criteria:

SCORING CRITERIA (1-10):
- Fit (30%): How well clothes fit the body, proportion, silhouette
- Color Harmony (25%): Color coordination, palette cohesion, contrast
- Accessories (20%): Appropriate accessories for the aesthetic, balance
- Layering (15%): Effective use of layers, texture mixing
- Aesthetic Alignment (10%): How well it matches ${aesthetic} style principles

RESPONSE FORMAT:
1. Overall Score: [X/10]
2. Brief Assessment: [2-3 sentences about the overall look]
3. Specific Suggestions (actionable bullet points):
   • [Specific item to add/change like "metallic crop top" or "denim jacket"]
   • [Specific fit adjustment like "try high-waisted jeans"]
   • [Specific color/accessory recommendation like "add silver jewelry"]
   • [Specific styling technique like "layer a white tee under blazer"]
4. Improvement Areas:
   - Fit: [X/10]
   - Color: [X/10] 
   - Accessories: [X/10]
   - Layering: [X/10]

Be specific with actual clothing items and brands when possible. Instead of "add accessories," say "try a silver chain necklace" or "add brown leather boots."`;
}

async function handleAnalyze(body: any) {
    const { imageUrl, aesthetic } = body;
    const prompt = buildStyleAnalysisPrompt(aesthetic);
      
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: prompt
                },
                {
                    role: 'user',
                    content: `Analyze this ${aesthetic} style outfit and provide a detailed assessment with specific, actionable suggestions. Image URL: ${imageUrl}`
                }
            ],
            max_tokens: 800,
            temperature: 0.3
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error(`OpenAI API error: ${response.status}`, errorText);
        throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

async function handleEvaluate(body: any) {
    const { beforeImage, afterImage, originalSuggestions, aesthetic } = body;
    const prompt = `You are evaluating style improvement. The user was given these specific suggestions: ${originalSuggestions.join(', ')}. 

Compare the before and after images and rate how well they implemented the suggestions. Score based on:
1. How many suggestions were followed (40%)
2. Overall style improvement (30%)
3. Aesthetic alignment with ${aesthetic} (20%)
4. Execution quality (10%)

Provide the same format as style analysis but focus on improvement and suggestion implementation.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'system',
                    content: prompt
                },
                {
                    role: 'user',
                    content: `Evaluate improvement from before image: ${beforeImage} to after image: ${afterImage}`
                }
            ],
            max_tokens: 600,
            temperature: 0.2
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error(`OpenAI API error: ${response.status}`, errorText);
        throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}


serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const body = await req.json();
        const { type } = body;
        let analysis;

        if (type === 'analyze') {
            analysis = await handleAnalyze(body);
        } else if (type === 'evaluate') {
            analysis = await handleEvaluate(body);
        } else {
            throw new Error("Invalid request type");
        }
        
        return new Response(JSON.stringify({ analysis }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('Error in analyze-style function:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
});
