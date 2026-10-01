import { YgoCard } from '../models/card.model';

export function getCardImage(card: YgoCard, size: 'small' | 'full'): string | null {
  if (!card.card_images || card.card_images.length === 0) {
    return null;
  }
  const image = card.card_images[0];
  return size === 'small' ? image.image_url_small : image.image_url;
}

export function hasValue(v: number | string | undefined | null): boolean {
  return v !== null && v !== undefined;
}
