
import { User, DigitalProduct, SubscriptionTier } from './types';

export const APP_FEE_PERCENTAGE = 5;
export const OPERATOR_NAME = "nknet consulting doo";
export const MAX_FILE_SIZE_MB = 50;
export const MAX_STORAGE_PER_CREATOR_MB = 5120;
export const AI_COST_PER_MINUTE = 0.0015; // Trošak u dolarima
export const GROWTH_BOOST_MINUTES_LIMIT = 100;

export const slugify = (text: string) => {
  return text.toString().toLowerCase().replace(/\s+/g, '-').replace(/[čć]/g, 'c').replace(/[š]/g, 's').replace(/[ž]/g, 'z').replace(/[đ]/g, 'dj').replace(/[^\w-]+/g, '').replace(/--+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
};

// Price Ladder Pretplate
export const DEFAULT_TIERS: SubscriptionTier[] = [
  { 
    id: 'tier-early', 
    name: 'Early Bird', 
    price: 4.99, 
    color: 'indigo', 
    benefits: ['Gledaj videe 3 dana ranije', 'Direktna obaveštenja', 'Značka prvog gledaoca'] 
  },
  { 
    id: 'tier-premium', 
    name: 'Premium Member', 
    price: 19.99, 
    color: 'emerald', 
    benefits: ['Svi PRODUŽENI videi (Arhiva)', 'Uključuje Early Bird status', 'Pristup Premium četu', 'Bez reklama'] 
  },
  { 
    id: 'tier-plus', 
    name: 'Premium Plus', 
    price: 29.99, 
    color: 'amber', 
    benefits: ['Sve iz Premium paketa', 'Prioritetni odgovor (2h)', 'Mesečna Tarot Tombola', 'Popust na privatne sesije'] 
  }
];

export const EXALTED_VENUS: User = {
  id: 'exalted-venus-001',
  username: 'exalted-venus',
  displayName: 'Exalted Venus Tarot',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
  banner: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1600&q=80',
  bio: 'Profesionalni astrolog i tarot tumač. Ovde objavljujem sadržaj koji je previše intiman ili detaljan za YouTube algoritme.',
  role: 'CREATOR',
  isVerified: true,
  isInternalProject: true,
  paymentMethods: { payoneerEmail: 'jecaman86@gmail.com', isVerified: true },
  stats: { 
    followersCount: 15600, 
    followingCount: 12, 
    balance: 1240.50, 
    storageUsed: 1200, 
    maxStorage: MAX_STORAGE_PER_CREATOR_MB,
    growthMinutesUsed: 42,
    growthMinutesTotal: GROWTH_BOOST_MINUTES_LIMIT
  },
  youtubeConfig: { 
    channelId: 'UC_exaltedvenus', 
    handle: '@exaltedvenustarotastrolog913', 
    isConnected: true 
  },
  subscriptionTiers: DEFAULT_TIERS,
  socialLinks: {
    youtube: 'https://www.youtube.com/@exaltedvenustarotastrolog913',
    tiktok: 'https://tiktok.com/@exaltedvenus',
    instagram: 'https://instagram.com/exaltedvenus'
  }
};

export const EXALTED_VENUS_PRODUCTS: DigitalProduct[] = [
  { 
    id: 'p-natal-annual', 
    name: 'Natalna Karta + Godišnji Horoskop', 
    description: 'Kompletno tumačenje životnog horoskopa + prognoza za 12 meseci. Trajanje: 45 min.', 
    price: 120.00, 
    type: 'CONSULTATION', 
    imageUrl: 'https://images.unsplash.com/photo-1515940175183-6798529cb860?w=400&q=80' 
  },
  { 
    id: 'p-synastry', 
    name: 'Uporedni Horoskop (Sinastrija)', 
    description: 'Analiza odnosa dve osobe. Detaljni aspekti privlačnosti i izazova.', 
    price: 130.00, 
    type: 'CONSULTATION', 
    imageUrl: 'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=400&q=80' 
  },
  { 
    id: 'p-tarot-session', 
    name: 'Tarot Tumačenje Uživo', 
    description: 'Gledate svako otvaranje karata i razgovaramo uživo putem video poziva.', 
    price: 65.00, 
    type: 'TAROT_READING', 
    imageUrl: 'https://images.unsplash.com/photo-1576669801775-ffed63192b48?w=400&q=80' 
  },
  { 
    id: 'p-audio-response', 
    name: 'Audio Odgovor na Pitanje', 
    description: 'Snimljen audio odgovor na jedno konkretno pitanje + jedno gratis pitanje.', 
    price: 55.00, 
    type: 'FILE_DOWNLOAD', 
    imageUrl: 'https://images.unsplash.com/photo-1583484963886-cccc2bf51944?w=400&q=80' 
  },
  { 
    id: 'v-extended-1', 
    name: 'LJUBAVNI ŽIVOT: Duboka Analiza (Video)', 
    description: 'PRODUŽENI VIDEO + 30 dana Early Bird statusa. Namere vaše osobe.', 
    price: 9.99, 
    type: 'EXTENDED_VIDEO', 
    imageUrl: 'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=800&q=80' 
  },
];

export const MOCK_FOLLOWERS: User[] = [{ id: 'user-101', username: 'marko', displayName: 'Marko J.', avatar: 'https://i.pravatar.cc/150?u=marko', bio: "Pratilac", role: 'FOLLOWER', isVerified: false, paymentMethods: { isVerified: false }, stats: { followersCount: 0, followingCount: 1, storageUsed: 0, maxStorage: 5120, growthMinutesUsed: 0, growthMinutesTotal: 0 } }];
export const MOCK_FOLLOWER = MOCK_FOLLOWERS[0];
export const ALL_USERS = [EXALTED_VENUS, ...MOCK_FOLLOWERS];
export const MOCK_CREATORS = [EXALTED_VENUS];
export const CATEGORIES = [{ id: 'astro', name: 'Astrologija & Tarot', icon: '🔮' }];

export const MOCK_TRANSACTIONS = [
  { id: 'tx-1', amount: 120.00, fee: 6.00, creator: 'exalted-venus', date: '2024-05-20' },
  { id: 'tx-2', amount: 45.00, fee: 2.25, creator: 'exalted-venus', date: '2024-05-21' },
  { id: 'tx-3', amount: 9.99, fee: 0.50, creator: 'exalted-venus', date: '2024-05-21' },
];
