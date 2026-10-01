import { YgoCard } from '../models/card.model';

export function extractExpansions(cards: YgoCard[]): string[] {
  const expansionsSet = new Set<string>();
  
  for (const card of cards) {
    if (card.card_sets && Array.isArray(card.card_sets)) {
      for (const set of card.card_sets) {
        if (set.set_name) {
          expansionsSet.add(set.set_name);
        }
      }
    }
  }

  return Array.from(expansionsSet).sort((a, b) => a.localeCompare(b));
}

export function filterByExpansion(cards: YgoCard[], expansion: string | null): YgoCard[] {
  if (!expansion) {
    return cards;
  }
  return cards.filter(card => {
    if (!card.card_sets || !Array.isArray(card.card_sets)) {
      return false;
    }
    return card.card_sets.some(set => set.set_name === expansion);
  });
}
