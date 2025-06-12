
interface StyleAnalysis {
  overallScore: number;
  fitScore: number;
  colorScore: number;
  accessoryScore: number;
  trendScore: number;
  feedback: string;
  suggestions: string[];
  improvements: StyleImprovement[];
}

interface StyleImprovement {
  category: 'color' | 'accessory' | 'fit' | 'style';
  suggestion: string;
  impact: 'high' | 'medium' | 'low';
  reason: string;
}

interface StyleFeatures {
  dominantColors: string[];
  accessoryCount: number;
  fitAssessment: 'loose' | 'fitted' | 'oversized';
  styleComplexity: number;
  colorHarmony: number;
}

export class StyleAnalysisService {
  private static instance: StyleAnalysisService;

  static getInstance(): StyleAnalysisService {
    if (!StyleAnalysisService.instance) {
      StyleAnalysisService.instance = new StyleAnalysisService();
    }
    return StyleAnalysisService.instance;
  }

  async analyzeStyle(imageUrl: string, aesthetic: string, userPreferences?: any): Promise<StyleAnalysis> {
    // Extract visual features for consistent rating
    const features = await this.extractVisualFeatures(imageUrl);
    
    // Generate consistent scores based on features
    const scores = this.calculateConsistentScores(features, aesthetic);
    
    // Generate contextual feedback
    const feedback = this.generateContextualFeedback(scores, aesthetic, features);
    
    // Generate improvement suggestions
    const improvements = this.generateImprovements(scores, aesthetic, features, userPreferences);
    
    return {
      overallScore: scores.overall,
      fitScore: scores.fit,
      colorScore: scores.color,
      accessoryScore: scores.accessory,
      trendScore: scores.trend,
      feedback,
      suggestions: improvements.map(imp => imp.suggestion),
      improvements
    };
  }

  private async extractVisualFeatures(imageUrl: string): Promise<StyleFeatures> {
    // Simulate visual feature extraction
    // In production, this would use actual computer vision
    const hash = this.generateImageHash(imageUrl);
    
    return {
      dominantColors: this.extractDominantColors(hash),
      accessoryCount: this.countAccessories(hash),
      fitAssessment: this.assessFit(hash),
      styleComplexity: this.calculateComplexity(hash),
      colorHarmony: this.calculateColorHarmony(hash)
    };
  }

  private generateImageHash(imageUrl: string): number {
    // Simple hash function for consistent results
    let hash = 0;
    for (let i = 0; i < imageUrl.length; i++) {
      const char = imageUrl.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  private extractDominantColors(hash: number): string[] {
    const colors = ['black', 'white', 'gray', 'navy', 'brown', 'red', 'blue', 'green'];
    const colorCount = (hash % 3) + 1;
    const selectedColors = [];
    
    for (let i = 0; i < colorCount; i++) {
      selectedColors.push(colors[(hash + i) % colors.length]);
    }
    
    return selectedColors;
  }

  private countAccessories(hash: number): number {
    return (hash % 4) + 1;
  }

  private assessFit(hash: number): 'loose' | 'fitted' | 'oversized' {
    const fits = ['loose', 'fitted', 'oversized'];
    return fits[hash % 3] as 'loose' | 'fitted' | 'oversized';
  }

  private calculateComplexity(hash: number): number {
    return (hash % 10) / 10;
  }

  private calculateColorHarmony(hash: number): number {
    return ((hash % 8) + 3) / 10;
  }

  private calculateConsistentScores(features: StyleFeatures, aesthetic: string) {
    const baseScore = 5;
    
    // Aesthetic-specific scoring logic
    const aestheticBonuses = {
      'y2k': this.calculateY2KScore(features),
      'old-money': this.calculateOldMoneyScore(features),
      'streetwear': this.calculateStreetwearScore(features),
      'minimalist': this.calculateMinimalistScore(features),
      'maximalist': this.calculateMaximalistScore(features),
      'coquette': this.calculateCoquetteScore(features)
    };

    const aestheticBonus = aestheticBonuses[aesthetic as keyof typeof aestheticBonuses] || 0;
    
    const fitScore = this.calculateFitScore(features);
    const colorScore = Math.round(features.colorHarmony * 10);
    const accessoryScore = this.calculateAccessoryScore(features, aesthetic);
    const trendScore = baseScore + aestheticBonus;
    
    const overall = Math.round((fitScore + colorScore + accessoryScore + trendScore) / 4);
    
    return {
      overall: Math.min(10, Math.max(1, overall)),
      fit: Math.min(10, Math.max(1, fitScore)),
      color: Math.min(10, Math.max(1, colorScore)),
      accessory: Math.min(10, Math.max(1, accessoryScore)),
      trend: Math.min(10, Math.max(1, trendScore))
    };
  }

  private calculateY2KScore(features: StyleFeatures): number {
    let bonus = 0;
    if (features.dominantColors.includes('silver') || features.dominantColors.includes('metallic')) bonus += 2;
    if (features.accessoryCount >= 3) bonus += 1;
    if (features.styleComplexity > 0.6) bonus += 1;
    return bonus;
  }

  private calculateOldMoneyScore(features: StyleFeatures): number {
    let bonus = 0;
    if (features.dominantColors.includes('navy') || features.dominantColors.includes('cream')) bonus += 2;
    if (features.fitAssessment === 'fitted') bonus += 2;
    if (features.colorHarmony > 0.7) bonus += 1;
    return bonus;
  }

  private calculateStreetwearScore(features: StyleFeatures): number {
    let bonus = 0;
    if (features.fitAssessment === 'oversized') bonus += 2;
    if (features.dominantColors.includes('black')) bonus += 1;
    if (features.accessoryCount >= 2) bonus += 1;
    return bonus;
  }

  private calculateMinimalistScore(features: StyleFeatures): number {
    let bonus = 0;
    if (features.dominantColors.length <= 2) bonus += 2;
    if (features.accessoryCount <= 2) bonus += 2;
    if (features.colorHarmony > 0.8) bonus += 1;
    return bonus;
  }

  private calculateMaximalistScore(features: StyleFeatures): number {
    let bonus = 0;
    if (features.dominantColors.length >= 3) bonus += 2;
    if (features.accessoryCount >= 4) bonus += 2;
    if (features.styleComplexity > 0.7) bonus += 1;
    return bonus;
  }

  private calculateCoquetteScore(features: StyleFeatures): number {
    let bonus = 0;
    if (features.dominantColors.includes('pink') || features.dominantColors.includes('white')) bonus += 2;
    if (features.fitAssessment === 'fitted') bonus += 1;
    if (features.accessoryCount >= 2) bonus += 1;
    return bonus;
  }

  private calculateFitScore(features: StyleFeatures): number {
    const fitScores = {
      'fitted': 8,
      'loose': 6,
      'oversized': 7
    };
    return fitScores[features.fitAssessment];
  }

  private calculateAccessoryScore(features: StyleFeatures, aesthetic: string): number {
    const idealAccessoryCount = {
      'minimalist': 1,
      'old-money': 2,
      'streetwear': 3,
      'y2k': 4,
      'maximalist': 5,
      'coquette': 3
    };

    const ideal = idealAccessoryCount[aesthetic as keyof typeof idealAccessoryCount] || 2;
    const difference = Math.abs(features.accessoryCount - ideal);
    return Math.max(4, 9 - difference);
  }

  private generateContextualFeedback(scores: any, aesthetic: string, features: StyleFeatures): string {
    const aestheticName = aesthetic.charAt(0).toUpperCase() + aesthetic.slice(1).replace('-', ' ');
    
    if (scores.overall >= 9) {
      return `Absolutely stunning! You've mastered the ${aestheticName} aesthetic perfectly. Your outfit coordination, color harmony (${features.colorHarmony.toFixed(1)}/1.0), and styling choices are impeccable.`;
    } else if (scores.overall >= 7) {
      return `Great ${aestheticName} foundation! Your ${features.fitAssessment} fit works well with your ${features.dominantColors.join(' and ')} color palette. A few small adjustments could make this look even more polished.`;
    } else if (scores.overall >= 5) {
      return `You understand the ${aestheticName} aesthetic basics. Your current ${features.dominantColors.join(' and ')} combination has potential, but there's room for improvement in execution and styling details.`;
    } else {
      return `This look needs work to capture the true ${aestheticName} essence. Consider revisiting the key elements: fit (currently ${features.fitAssessment}), color coordination, and accessory balance.`;
    }
  }

  private generateImprovements(scores: any, aesthetic: string, features: StyleFeatures, userPreferences?: any): StyleImprovement[] {
    const improvements: StyleImprovement[] = [];

    // Color improvements
    if (scores.color < 7) {
      improvements.push({
        category: 'color',
        suggestion: this.getColorSuggestion(aesthetic, features),
        impact: 'high',
        reason: 'Better color harmony will instantly elevate your look'
      });
    }

    // Accessory improvements
    if (scores.accessory < 7) {
      improvements.push({
        category: 'accessory',
        suggestion: this.getAccessorySuggestion(aesthetic, features),
        impact: 'medium',
        reason: 'The right accessories can transform your entire outfit'
      });
    }

    // Fit improvements
    if (scores.fit < 7) {
      improvements.push({
        category: 'fit',
        suggestion: this.getFitSuggestion(aesthetic, features),
        impact: 'high',
        reason: 'Proper fit is the foundation of any great look'
      });
    }

    // Style-specific improvements
    improvements.push({
      category: 'style',
      suggestion: this.getStyleSuggestion(aesthetic, features),
      impact: 'medium',
      reason: `This will enhance your ${aesthetic} aesthetic`
    });

    return improvements.slice(0, 3); // Return top 3 improvements
  }

  private getColorSuggestion(aesthetic: string, features: StyleFeatures): string {
    const suggestions = {
      'y2k': 'Try adding metallic silver accents or holographic details to enhance the futuristic vibe',
      'old-money': 'Replace bright colors with neutral tones like cream, navy, or camel for timeless elegance',
      'streetwear': 'Add a pop of neon color or stick to urban neutrals like black, white, and grey',
      'minimalist': 'Simplify to a monochromatic palette - try all black or varying shades of one color',
      'maximalist': 'Mix bold, contrasting colors - try pairing bright pink with emerald green',
      'coquette': 'Incorporate soft pastels like blush pink, lavender, or cream for romantic femininity'
    };
    return suggestions[aesthetic as keyof typeof suggestions] || 'Consider a more cohesive color palette';
  }

  private getAccessorySuggestion(aesthetic: string, features: StyleFeatures): string {
    const suggestions = {
      'y2k': 'Add chrome jewelry, platform boots, or a holographic bag for authentic Y2K vibes',
      'old-money': 'Try a classic gold watch, pearl necklace, or structured leather handbag',
      'streetwear': 'Consider chunky sneakers, a baseball cap, or a statement chain',
      'minimalist': 'Keep it simple with a delicate watch or single piece of geometric jewelry',
      'maximalist': 'Layer multiple statement pieces - bold earrings, colorful scarves, and patterned bags',
      'coquette': 'Add delicate jewelry like layered necklaces, hair bows, or vintage-inspired pieces'
    };
    return suggestions[aesthetic as keyof typeof suggestions] || 'Consider adding complementary accessories';
  }

  private getFitSuggestion(aesthetic: string, features: StyleFeatures): string {
    const suggestions = {
      'y2k': 'Try low-rise jeans with a fitted crop top, or an oversized metallic jacket',
      'old-money': 'Opt for well-tailored pieces - a structured blazer or perfectly fitted trousers',
      'streetwear': 'Go oversized with hoodies and baggy jeans, or try fitted athleisure',
      'minimalist': 'Choose clean, structured silhouettes that skim your body without being tight',
      'maximalist': 'Mix different fits - pair oversized tops with fitted bottoms or vice versa',
      'coquette': 'Try fitted bodices with flowy skirts, or cropped cardigans with high-waisted bottoms'
    };
    return suggestions[aesthetic as keyof typeof suggestions] || 'Consider adjusting the fit for better proportion';
  }

  private getStyleSuggestion(aesthetic: string, features: StyleFeatures): string {
    const suggestions = {
      'y2k': 'Add tech-wear elements like cargo pants with straps or LED accessories',
      'old-money': 'Layer a cashmere sweater under a blazer for sophisticated texture',
      'streetwear': 'Try layering a long-sleeve shirt under a graphic tee for urban style',
      'minimalist': 'Focus on quality fabrics and clean lines - less is truly more',
      'maximalist': 'Don\'t be afraid to mix patterns - try stripes with florals or polka dots',
      'coquette': 'Add romantic details like lace trim, ruffles, or vintage-inspired buttons'
    };
    return suggestions[aesthetic as keyof typeof suggestions] || 'Consider enhancing your style with signature elements';
  }
}
