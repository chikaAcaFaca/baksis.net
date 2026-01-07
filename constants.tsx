
import { User, DigitalProduct, SubscriptionTier } from './types';

export const APP_FEE_PERCENTAGE = 5;
export const OPERATOR_NAME = "nknet consulting doo";
export const MAX_FILE_SIZE_MB = 50;
export const MAX_STORAGE_PER_CREATOR_MB = 5120;

export const slugify = (text: string) => {
  return text.toString().toLowerCase().replace(/\s+/g, '-').replace(/[čć]/g, 'c').replace(/[š]/g, 's').replace(/[ž]/g, 'z').replace(/[đ]/g, 'dj').replace(/[^\w-]+/g, '').replace(/--+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
};

export const DEFAULT_TIERS: SubscriptionTier[] = [
  { id: 'tier-early', name: 'Early Bird Access', price: 4.99, color: 'indigo', benefits: ['Gledaj YT videe 7 dana ranije', 'Pristup četu'] },
  { id: 'tier-premium', name: 'Premium Membership', price: 19.99, color: 'emerald', benefits: ['Sve iz Early Bird', '5+ PRODUŽENIH videa mesečno', 'Direktne poruke'] },
  { id: 'tier-plus', name: 'Premium Plus Raffle', price: 29.99, color: 'amber', benefits: ['Sve iz Premium', '4x Mesečna tombola za Tarot', 'Lična astro preporuka'] }
];

export const EXALTED_VENUS: User = {
  id: 'exalted-venus-001',
  username: 'exalted-venus',
  displayName: 'Exalted Venus',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
  banner: 'https://images.unsplash.com/photo-1515940175183-6798529cb860?w=1600&q=80',
  bio: 'Profesionalni astrolog i tarot tumač. Otkrivam tajne vašeg sudbinskog koda putem personalizovanih tumačenja i video poziva.',
  role: 'CREATOR',
  isVerified: true,
  isInternalProject: true,
  paymentMethods: { payoneerEmail: 'jecaman86@gmail.com', isVerified: true },
  stats: { followersCount: 15600, followingCount: 12, balance: 1240.50, storageUsed: 1200, maxStorage: MAX_STORAGE_PER_CREATOR_MB },
  youtubeConfig: { channelId: 'UC_astro', handle: '@exaltedvenus', isConnected: true },
  subscriptionTiers: DEFAULT_TIERS
};

export const EXALTED_VENUS_PRODUCTS: DigitalProduct[] = [
  { id: 'p-natal-annual', name: 'Natalna Karta + Godišnji Horoskop', description: 'Kompletno tumačenje (45 min WhatsApp/Viber video poziv). Prognoze za 12 meseci.', price: 120.00, type: 'CONSULTATION', imageUrl: 'https://images.unsplash.com/photo-1515940175183-6798529cb860?w=400&q=80' },
  { id: 'p-synastry', name: 'Uporedni Horoskop (Sinastrija)', description: 'Tumačenje odnosa za parove. Potrebni podaci za obe osobe.', price: 130.00, type: 'CONSULTATION', imageUrl: 'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=400&q=80' },
  { id: 'p-tarot-session', name: 'Tarot Tumačenje Uživo', description: 'Video poziv uživo. Gledate otvaranje karata i razgovaramo na vašu temu.', price: 65.00, type: 'TAROT_READING', imageUrl: 'https://images.unsplash.com/photo-1576669801775-ffed63192b48?w=400&q=80' },
  { id: 'p-audio-q', name: 'Audio Odgovor (1+1 Pitanje)', description: 'Snimljen audio fajl sa konkretnim odgovorima na vaša pitanja.', price: 55.00, type: 'SERVICE', imageUrl: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&q=80' }
];

export const MOCK_TRANSACTIONS = [
  { id: 'tx-1', amount: 120.00, fee: 6.00, date: new Date(), creatorId: 'exalted-venus-001' },
  { id: 'tx-2', amount: 9.99, fee: 0.50, date: new Date(), creatorId: 'exalted-venus-001' },
  { id: 'tx-3', amount: 65.00, fee: 3.25, date: new Date(), creatorId: 'exalted-venus-001' },
];

export const MOCK_FOLLOWERS: User[] = [{ id: 'user-101', username: 'marko', displayName: 'Marko J.', avatar: 'https://i.pravatar.cc/150?u=marko', bio: "Pratilac", role: 'FOLLOWER', isVerified: false, paymentMethods: { isVerified: false }, stats: { followersCount: 0, followingCount: 1, storageUsed: 0, maxStorage: 5120 } }];
export const MOCK_FOLLOWER = MOCK_FOLLOWERS[0];
export const ALL_USERS = [EXALTED_VENUS, ...MOCK_FOLLOWERS];
export const MOCK_CREATORS = [EXALTED_VENUS];
export const CATEGORIES = [{ id: 'astro', name: 'Astrologija & Tarot', icon: '🔮' }];
