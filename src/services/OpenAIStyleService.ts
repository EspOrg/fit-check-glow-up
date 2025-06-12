
interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface StyleAnalysisResult {
  overallScore: number;
  feedback: string;
  specificSuggestions: string[];
  improvementAreas: {
    fit: number;
    color: number;
    accessories: number;
    layering: number;
  };
}

export class OpenAIStyleService {
  private static instance: OpenAIStyleService;
  private apiKey = 'sk-proj-Gk7kKjY7hVyxkBU4KvObT3BlbkFJhE7kOGAe6TrHEYxr4Zy4A';

  static getInstance(): OpenAIStyleService {
    if (!OpenAIStyleService.instance) {
      OpenAIStyleService.instance = new OpenAIStyleService();
    }
    return OpenAIStyleService.instance;
  }

  async analyzeStyleWithAI(imageUrl: string, aesthetic: string): Promise<StyleAnalysisResult> {
    try {
      const prompt = this.buildStyleAnalysisPrompt(aesthetic);
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
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
              content: `Analyze this ${aesthetic} style outfit and provide a detailed assessment with specific, actionable suggestions. Image URL: ${imageUrl}`
            }
          ],
          max_tokens: 800,
          temperature: 0.3
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data: OpenAIResponse = await response.json();
      const analysis = data.choices[0].message.content;
      
      return this.parseAIResponse(analysis, aesthetic);
    } catch (error) {
      console.error('OpenAI Style Analysis failed:', error);
      throw error;
    }
  }

  private buildStyleAnalysisPrompt(aesthetic: string): string {
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
   • [Specific item to add/change]
   • [Specific fit adjustment]
   • [Specific color/accessory recommendation]
   • [Specific styling technique]
4. Improvement Areas:
   - Fit: [X/10]
   - Color: [X/10] 
   - Accessories: [X/10]
   - Layering: [X/10]

Be specific and actionable. Instead of "add accessories," say "add a silver chain necklace" or "try brown leather boots."`;
  }

  private parseAIResponse(analysis: string, aesthetic: string): StyleAnalysisResult {
    // Extract overall score
    const scoreMatch = analysis.match(/Overall Score:\s*(\d+)/i);
    const overallScore = scoreMatch ? parseInt(scoreMatch[1]) : 6;

    // Extract feedback (brief assessment)
    const feedbackMatch = analysis.match(/Brief Assessment:\s*([^•\n]+)/i);
    const feedback = feedbackMatch ? feedbackMatch[1].trim() : `Good ${aesthetic} foundation with room for improvement.`;

    // Extract specific suggestions
    const suggestionsSection = analysis.match(/Specific Suggestions[^•]*([•\-\*].*?)(?=Improvement Areas|$)/is);
    const suggestions = suggestionsSection 
      ? suggestionsSection[1].match(/[•\-\*]\s*([^\n•\-\*]+)/g)?.map(s => s.replace(/[•\-\*]\s*/, '').trim()) || []
      : ['Try a more fitted silhouette', 'Add complementary accessories', 'Consider color coordination'];

    // Extract improvement areas scores
    const fitMatch = analysis.match(/Fit:\s*(\d+)/i);
    const colorMatch = analysis.match(/Color:\s*(\d+)/i);
    const accessoriesMatch = analysis.match(/Accessories:\s*(\d+)/i);
    const layeringMatch = analysis.match(/Layering:\s*(\d+)/i);

    return {
      overallScore,
      feedback,
      specificSuggestions: suggestions.slice(0, 4), // Limit to 4 suggestions
      improvementAreas: {
        fit: fitMatch ? parseInt(fitMatch[1]) : Math.max(1, overallScore - 1),
        color: colorMatch ? parseInt(colorMatch[1]) : Math.max(1, overallScore - 1),
        accessories: accessoriesMatch ? parseInt(accessoriesMatch[1]) : Math.max(1, overallScore - 2),
        layering: layeringMatch ? parseInt(layeringMatch[1]) : Math.max(1, overallScore - 1)
      }
    };
  }

  async evaluateImprovement(
    beforeImage: string, 
    afterImage: string, 
    originalSuggestions: string[], 
    aesthetic: string
  ): Promise<StyleAnalysisResult> {
    try {
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
          'Authorization': `Bearer ${this.apiKey}`,
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
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data: OpenAIResponse = await response.json();
      const analysis = data.choices[0].message.content;
      
      return this.parseAIResponse(analysis, aesthetic);
    } catch (error) {
      console.error('OpenAI Improvement Evaluation failed:', error);
      throw error;
    }
  }
}
