
export interface PromptContext {
  aesthetic: string;
  currentScore: number;
  dominantColors: string[];
  userMessage: string;
  previousSuggestions: string[];
  userPreferences?: {
    favoriteColors: string[];
    preferredFit: string;
    dislikedItems: string[];
  };
}

export class AdvancedPromptEngine {
  private static instance: AdvancedPromptEngine;

  static getInstance(): AdvancedPromptEngine {
    if (!AdvancedPromptEngine.instance) {
      AdvancedPromptEngine.instance = new AdvancedPromptEngine();
    }
    return AdvancedPromptEngine.instance;
  }

  generateContextualResponse(context: PromptContext): {
    response: string;
    suggestions: string[];
    actionableItems: string[];
  } {
    const basePrompts = this.getBasePrompts(context.aesthetic);
    const contextualPrompt = this.buildContextualPrompt(context);
    
    // Generate response based on user message intent
    const intent = this.analyzeIntent(context.userMessage);
    const response = this.generateResponse(intent, context, basePrompts);
    const suggestions = this.generateActionableSuggestions(context, intent);
    const actionableItems = this.generateActionableItems(context);

    return {
      response,
      suggestions,
      actionableItems
    };
  }

  private getBasePrompts(aesthetic: string): any {
    return {
      'y2k': {
        colorAdvice: "For Y2K vibes, think metallics, neon pinks, electric blues, and holographic elements. Chrome and silver accessories are essential!",
        accessoryPrompt: "Y2K accessories: chunky platforms, metallic bags, chrome jewelry, tech-wear elements, and futuristic sunglasses",
        fitAdvice: "Mix fitted crop tops with low-rise bottoms, or go oversized with metallic jackets. Contrast is key!",
        enhancementTips: "Add LED elements, holographic details, or metallic fabrics. Think cyber-princess meets early 2000s pop star"
      },
      'old-money': {
        colorAdvice: "Stick to timeless neutrals: cream, navy, camel, forest green, and classic black or white. Avoid bright, flashy colors",
        accessoryPrompt: "Old money essentials: pearl jewelry, gold watches, structured leather bags, silk scarves, and classic sunglasses",
        fitAdvice: "Tailored and sophisticated. Well-fitted blazers, straight-leg trousers, and pieces that skim the body perfectly",
        enhancementTips: "Invest in quality fabrics like cashmere, silk, and wool. Layer thoughtfully with timeless pieces"
      },
      'streetwear': {
        colorAdvice: "Urban palette: black, white, grey with pops of bright colors. Think graphic tees, bold logos, and statement pieces",
        accessoryPrompt: "Streetwear staples: chunky sneakers, baseball caps, chain jewelry, backpacks, and logo-heavy pieces",
        fitAdvice: "Oversized hoodies, baggy jeans, or fitted athleisure. Mix proportions for visual interest",
        enhancementTips: "Layer different textures, mix high and low brands, and add statement sneakers as focal points"
      },
      'minimalist': {
        colorAdvice: "Less is more: monochromatic palettes, neutral tones, and clean color blocking. Avoid busy patterns",
        accessoryPrompt: "Minimal accessories: simple geometric jewelry, structured bags, classic watches, and clean-lined pieces",
        fitAdvice: "Clean, structured silhouettes that fit perfectly. Avoid excess fabric or overly tight fits",
        enhancementTips: "Focus on quality over quantity. Choose pieces with interesting textures or subtle architectural details"
      },
      'maximalist': {
        colorAdvice: "More is more! Mix bold colors, clash patterns, and embrace rainbow palettes. Don't hold back!",
        accessoryPrompt: "Maximalist paradise: statement earrings, layered necklaces, colorful bags, and bold prints everywhere",
        fitAdvice: "Mix different fits and proportions. Oversized with fitted, structured with flowy - create visual interest",
        enhancementTips: "Layer different patterns, mix textures wildly, and add as many statement pieces as you can handle"
      },
      'coquette': {
        colorAdvice: "Soft and romantic: blush pink, cream, white, pastels, and dreamy feminine tones. Think fairy tale princess",
        accessoryPrompt: "Coquette essentials: delicate jewelry, hair bows, vintage-inspired pieces, and romantic details",
        fitAdvice: "Fitted bodices with flowy skirts, cropped cardigans, and pieces that enhance your silhouette romantically",
        enhancementTips: "Add lace details, ruffles, vintage buttons, and feminine touches that make you feel like a fairy tale character"
      }
    };
  }

  private buildContextualPrompt(context: PromptContext): string {
    return `
      User is styling for ${context.aesthetic} aesthetic.
      Current style score: ${context.currentScore}/10
      Dominant colors in current outfit: ${context.dominantColors.join(', ')}
      User preference context: ${context.userPreferences ? JSON.stringify(context.userPreferences) : 'None provided'}
      Previous suggestions given: ${context.previousSuggestions.join(', ')}
      
      Focus on specific, actionable improvements that will elevate their look immediately.
      Be encouraging but specific about what changes would have the highest impact.
    `;
  }

  private analyzeIntent(userMessage: string): string {
    const message = userMessage.toLowerCase();
    
    if (message.includes('color') || message.includes('colour')) return 'color-advice';
    if (message.includes('accessory') || message.includes('accessories')) return 'accessory-advice';
    if (message.includes('fit') || message.includes('sizing')) return 'fit-advice';
    if (message.includes('shop') || message.includes('buy') || message.includes('where')) return 'shopping-advice';
    if (message.includes('improve') || message.includes('better') || message.includes('fix')) return 'improvement-advice';
    if (message.includes('style') || message.includes('aesthetic')) return 'style-advice';
    if (message.includes('help') || message.includes('suggestion')) return 'general-help';
    
    return 'general-chat';
  }

  private generateResponse(intent: string, context: PromptContext, basePrompts: any): string {
    const aestheticName = context.aesthetic.charAt(0).toUpperCase() + context.aesthetic.slice(1).replace('-', ' ');
    const prompts = basePrompts[context.aesthetic] || basePrompts['y2k'];
    
    const responses = {
      'color-advice': `Bestie, let's talk colors for your ${aestheticName} vibe! ✨ ${prompts.colorAdvice} Based on your current ${context.dominantColors.join(' and ')} palette, here's what would make it pop even more!`,
      
      'accessory-advice': `Accessories can totally transform your look! 💎 ${prompts.accessoryPrompt} Since you're going for ${aestheticName}, these pieces would be absolutely perfect!`,
      
      'fit-advice': `The fit is everything, bestie! 👗 ${prompts.fitAdvice} This will totally elevate your ${aestheticName} aesthetic and make you look amazing!`,
      
      'shopping-advice': `Let me help you find the perfect pieces! 🛍️ For your ${aestheticName} aesthetic, I'd recommend checking out specific stores and brands that really nail this vibe!`,
      
      'improvement-advice': `I see so much potential here! 🌟 With your current ${context.currentScore}/10 score, we can definitely get you to the next level. Here are the changes that will have the biggest impact on your ${aestheticName} look!`,
      
      'style-advice': `Your ${aestheticName} journey is looking amazing! ✨ ${prompts.enhancementTips} Let me give you some insider tips to really make this aesthetic shine!`,
      
      'general-help': `Hey bestie! I'm here to help you serve the most amazing ${aestheticName} looks! 💅 Whether it's colors, fits, accessories, or shopping - I've got you covered!`,
      
      'general-chat': `Yesss bestie! I'm loving the ${aestheticName} energy! 🔥 Your current look has such great potential - let me help you take it to the next level!`
    };

    return responses[intent as keyof typeof responses] || responses['general-chat'];
  }

  private generateActionableSuggestions(context: PromptContext, intent: string): string[] {
    const suggestions = {
      'color-advice': [
        `Try adding ${this.getColorSuggestion(context.aesthetic)} to your current palette`,
        `Replace your ${context.dominantColors[0]} piece with ${this.getAlternativeColor(context.aesthetic)}`,
        `Add a pop of ${this.getAccentColor(context.aesthetic)} through accessories`
      ],
      'accessory-advice': [
        this.getSpecificAccessorySuggestion(context.aesthetic),
        this.getJewelrySuggestion(context.aesthetic),
        this.getBagSuggestion(context.aesthetic)
      ],
      'improvement-advice': [
        this.getHighImpactImprovement(context.aesthetic),
        this.getMediumImpactImprovement(context.aesthetic),
        this.getQuickFix(context.aesthetic)
      ]
    };

    return suggestions[intent as keyof typeof suggestions] || suggestions['improvement-advice'];
  }

  private generateActionableItems(context: PromptContext): string[] {
    return [
      `Shop for ${context.aesthetic} essentials`,
      `Try a new color palette`,
      `Experiment with different fits`,
      `Add signature accessories`,
      `Mix textures and patterns`
    ];
  }

  private getColorSuggestion(aesthetic: string): string {
    const colors = {
      'y2k': 'metallic silver or holographic pink',
      'old-money': 'cream or navy blue',
      'streetwear': 'neon green or electric blue',
      'minimalist': 'pure white or deep black',
      'maximalist': 'bright orange or electric purple',
      'coquette': 'soft blush pink or lavender'
    };
    return colors[aesthetic as keyof typeof colors] || 'complementary tones';
  }

  private getAlternativeColor(aesthetic: string): string {
    const alternatives = {
      'y2k': 'chrome silver',
      'old-money': 'sophisticated camel',
      'streetwear': 'urban black',
      'minimalist': 'pure white',
      'maximalist': 'bold fuchsia',
      'coquette': 'romantic cream'
    };
    return alternatives[aesthetic as keyof typeof alternatives] || 'a more suitable shade';
  }

  private getAccentColor(aesthetic: string): string {
    const accents = {
      'y2k': 'electric blue',
      'old-money': 'gold',
      'streetwear': 'neon yellow',
      'minimalist': 'soft grey',
      'maximalist': 'rainbow gradient',
      'coquette': 'rose gold'
    };
    return accents[aesthetic as keyof typeof accents] || 'complementary color';
  }

  private getSpecificAccessorySuggestion(aesthetic: string): string {
    const accessories = {
      'y2k': 'Add chunky platform boots or holographic bag',
      'old-money': 'Try a structured leather handbag or pearl necklace',
      'streetwear': 'Consider chunky white sneakers or a baseball cap',
      'minimalist': 'Add a simple gold watch or geometric earrings',
      'maximalist': 'Layer bold statement necklaces or colorful scarves',
      'coquette': 'Try delicate hair bows or vintage-inspired jewelry'
    };
    return accessories[aesthetic as keyof typeof accessories] || 'Add complementary accessories';
  }

  private getJewelrySuggestion(aesthetic: string): string {
    const jewelry = {
      'y2k': 'Chrome chains or metallic chokers',
      'old-money': 'Classic gold watch or pearl earrings',
      'streetwear': 'Chunky chain necklace or hoop earrings',
      'minimalist': 'Delicate gold rings or simple studs',
      'maximalist': 'Mix multiple bold pieces together',
      'coquette': 'Layered delicate necklaces or vintage rings'
    };
    return jewelry[aesthetic as keyof typeof jewelry] || 'Choose appropriate jewelry';
  }

  private getBagSuggestion(aesthetic: string): string {
    const bags = {
      'y2k': 'Holographic mini bag or metallic backpack',
      'old-money': 'Structured leather tote or classic clutch',
      'streetwear': 'Oversized backpack or crossbody bag',
      'minimalist': 'Clean-lined tote or simple crossbody',
      'maximalist': 'Bold patterned bag or colorful statement piece',
      'coquette': 'Vintage-inspired purse or delicate chain bag'
    };
    return bags[aesthetic as keyof typeof bags] || 'Choose a suitable bag';
  }

  private getHighImpactImprovement(aesthetic: string): string {
    const improvements = {
      'y2k': 'Switch to low-rise jeans with a metallic crop top',
      'old-money': 'Add a perfectly tailored blazer in navy or camel',
      'streetwear': 'Try oversized hoodie with fitted bottom half',
      'minimalist': 'Choose one standout piece in perfect neutral tone',
      'maximalist': 'Layer 3+ bold patterns together confidently',
      'coquette': 'Add a flowy midi skirt with fitted feminine top'
    };
    return improvements[aesthetic as keyof typeof improvements] || 'Make a significant style change';
  }

  private getMediumImpactImprovement(aesthetic: string): string {
    const improvements = {
      'y2k': 'Add platform shoes or metallic accessories',
      'old-money': 'Include a silk scarf or cashmere sweater',
      'streetwear': 'Incorporate logo pieces or statement sneakers',
      'minimalist': 'Focus on quality fabrics and perfect fit',
      'maximalist': 'Add more colorful or patterned accessories',
      'coquette': 'Include lace details or romantic accessories'
    };
    return improvements[aesthetic as keyof typeof improvements] || 'Add complementary elements';
  }

  private getQuickFix(aesthetic: string): string {
    const fixes = {
      'y2k': 'Add chrome jewelry or holographic nail polish',
      'old-money': 'Tuck in your shirt and add a belt',
      'streetwear': 'Roll up sleeves or add a cap',
      'minimalist': 'Remove one accessory for cleaner look',
      'maximalist': 'Add one more bold element',
      'coquette': 'Add a hair bow or delicate bracelet'
    };
    return fixes[aesthetic as keyof typeof fixes] || 'Make a small adjustment';
  }
}
