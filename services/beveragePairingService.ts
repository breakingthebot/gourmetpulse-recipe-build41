// services/beveragePairingService.ts
// Sommelier beverage & wine pairing recommender service for gourmet recipes.
// Connects to: components/BeveragePairingRecommender.vue, stores/recipeStore.ts
// Created: 2026-07-25

export interface BeveragePairing {
  id: string;
  name: string;
  category: 'Red Wine' | 'White Wine' | 'Craft Beer' | 'Non-Alcoholic' | 'Cocktail';
  icon: string;
  tastingNotes: string;
  idealTemperature: string;
  matchScore: number;
}

export function getBeveragePairingsForRecipe(category: string, title: string): BeveragePairing[] {
  const lowerTitle = title.toLowerCase();

  if (lowerTitle.includes('risotto') || lowerTitle.includes('mushroom') || lowerTitle.includes('truffle')) {
    return [
      {
        id: 'bev-1',
        name: 'Piedmont Nebbiolo / Barolo',
        category: 'Red Wine',
        icon: '🍷',
        tastingNotes: 'High acidity and silky tannins with notes of dried rose petals, dark cherry, and forest floor that accentuate wild earthiness.',
        idealTemperature: '16°C - 18°C (60°F - 64°F)',
        matchScore: 98
      },
      {
        id: 'bev-2',
        name: 'Belgian Saison Farmhouse Ale',
        category: 'Craft Beer',
        icon: '🍺',
        tastingNotes: 'Earthy, peppery yeast esters and crisp carbonation cut through rich truffle creaminess seamlessly.',
        idealTemperature: '7°C - 10°C (45°F - 50°F)',
        matchScore: 92
      },
      {
        id: 'bev-3',
        name: 'Sparkling Rosemary Botanical Tonic',
        category: 'Non-Alcoholic',
        icon: '🍹',
        tastingNotes: 'Woody rosemary and crisp sparkling effervescence cleanse the palate between rich bites.',
        idealTemperature: '4°C - 6°C (39°F - 43°F)',
        matchScore: 89
      }
    ];
  }

  if (lowerTitle.includes('salmon') || lowerTitle.includes('seafood') || lowerTitle.includes('shrimp') || lowerTitle.includes('fish')) {
    return [
      {
        id: 'bev-4',
        name: 'Sancerre Sauvignon Blanc',
        category: 'White Wine',
        icon: '🥂',
        tastingNotes: 'Electric minerality with zesty grapefruit and flint notes that elevate citrus lemon dill butter.',
        idealTemperature: '8°C - 10°C (46°F - 50°F)',
        matchScore: 99
      },
      {
        id: 'bev-5',
        name: 'Provence Dry Rosé',
        category: 'White Wine',
        icon: '🍷',
        tastingNotes: 'Crisp red berry acidity and subtle minerality compliment pan-seared crispy skin.',
        idealTemperature: '10°C - 12°C (50°F - 54°F)',
        matchScore: 94
      },
      {
        id: 'bev-6',
        name: 'Sparkling Cucumber Mint Fizz',
        category: 'Non-Alcoholic',
        icon: '🍹',
        tastingNotes: 'Cooling garden cucumber with muddled mint leaves and lime zest for ultra-refreshing pairing.',
        idealTemperature: '4°C (39°F)',
        matchScore: 91
      }
    ];
  }

  if (lowerTitle.includes('chocolate') || lowerTitle.includes('lava') || lowerTitle.includes('cake') || category === 'Dessert') {
    return [
      {
        id: 'bev-7',
        name: 'Aged 20-Year Tawny Port',
        category: 'Red Wine',
        icon: '🍷',
        tastingNotes: 'Velvety sweetness with notes of toasted hazelnut, fig, and dark cocoa ganache.',
        idealTemperature: '14°C - 16°C (57°F - 60°F)',
        matchScore: 97
      },
      {
        id: 'bev-8',
        name: 'Imperial Bourbon Barrel Stout',
        category: 'Craft Beer',
        icon: '🍺',
        tastingNotes: 'Roasty espresso beans, dark chocolate, and warm vanilla oak finish.',
        idealTemperature: '12°C - 14°C (54°F - 57°F)',
        matchScore: 95
      },
      {
        id: 'bev-9',
        name: 'Nitro Cold Brew Espresso',
        category: 'Non-Alcoholic',
        icon: '☕',
        tastingNotes: 'Creamy nitrogen head with intense dark roast crema complementing warm chocolate centers.',
        idealTemperature: '4°C (39°F)',
        matchScore: 93
      }
    ];
  }

  // Default pairs for general dishes
  return [
    {
      id: 'bev-10',
      name: 'Sonoma Coast Chardonnay',
      category: 'White Wine',
      icon: '🥂',
      tastingNotes: 'Balanced oak, crisp green apple, and subtle brioche richness.',
      idealTemperature: '10°C - 12°C (50°F - 54°F)',
      matchScore: 93
    },
    {
      id: 'bev-11',
      name: 'Artisan Citrus Hops Pale Ale',
      category: 'Craft Beer',
      icon: '🍺',
      tastingNotes: 'Bright tropical fruit aromas and refreshing citrus bitterness.',
      idealTemperature: '6°C - 8°C (43°F - 46°F)',
      matchScore: 90
    },
    {
      id: 'bev-12',
      name: 'Yuzu Ginger Blossom Sparkler',
      category: 'Non-Alcoholic',
      icon: '🍹',
      tastingNotes: 'Tart Japanese yuzu juice balanced with spicy ginger root and sparkling water.',
      idealTemperature: '4°C (39°F)',
      matchScore: 88
    }
  ];
}
