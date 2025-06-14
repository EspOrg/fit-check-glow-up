import { supabase } from "@/integrations/supabase/client";

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export interface StyleAnalysisResult {
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

  static getInstance(): OpenAIStyleService {
    if (!OpenAIStyleService.instance) {
      OpenAIStyleService.instance = new OpenAIStyleService();
    }
    return OpenAIStyleService.instance;
  }

  async analyzeStyleWithAI(imageUrl: string, aesthetic: string): Promise<StyleAnalysisResult> {
    try {
      const { data, error } = await supabase.functions.invoke('analyze-style', {
        body: {
          type: 'analyze',
          imageUrl,
          aesthetic,
        }
      });

      if (error) throw error;

      const { analysis } = data;
      return this.parseAIResponse(analysis, aesthetic);
    } catch (error) {
      console.error('OpenAI Style Analysis failed:', error);
      throw error;
    }
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
      const { data, error } = await supabase.functions.invoke('analyze-style', {
        body: {
          type: 'evaluate',
          beforeImage,
          afterImage,
          originalSuggestions,
          aesthetic,
        }
      });

      if (error) throw error;

      const { analysis } = data;
      return this.parseAIResponse(analysis, aesthetic);
    } catch (error) {
      console.error('OpenAI Improvement Evaluation failed:', error);
      throw error;
    }
  }
}
