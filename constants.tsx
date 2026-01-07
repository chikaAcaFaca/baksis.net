
import { User, DigitalProduct, ExtendedVideo, RaffleSession, Transaction } from './types';

export const APP_FEE_PERCENTAGE = 5;
export const OPERATOR_NAME = "nknet consulting doo";
export const MAX_FILE_SIZE_MB = 50;
export const MAX_STORAGE_PER_CREATOR_MB = 5120;

// Helper za čišćenje URL-ova
export const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')           // Razmaci u crtice
    .replace(/[čć]/g, 'c')          // Č, Ć -> C
    .replace(/[š]/g, 's')           // Š -> S
    .replace(/[ž]/g, 'z')           // Ž -> Z
    .replace(/[đ]/g, 'dj')          // Đ -> DJ
    .replace(/[^\w-]+/g, '')        // Ukloni ostale karaktere
    .replace(/--+/g, '-')           // Duple crtice u jednu
    .replace(/^-+/, '')             // Ukloni crtice s početka
    .replace(/-+$/, '');            // Ukloni crtice s kraja
};

export const EXALTED_VENUS: User = {
  id: 'exalted-venus-001',
  username: 'exalted-venus',
  displayName: 'Exalted Venus',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
  bio: 'Profesionalni astrolog i tarot tumač. Otkrivam tajne vašeg sudbinskog koda. Konsultacije uživo i instant digitalni vodiči.',
  role: 'CREATOR',
  isVerified: true,
  isInternalProject: true,
  paymentMethods: { 
    payoneerEmail: 'jecaman86@gmail.com', 
    payoneerId: 'EV-882194',
    isVerified: true 
  },
  stats: { 
    followersCount: 15600, 
    followingCount: 12, 
    balance: 1240.50,
    storageUsed: 1200, 
    maxStorage: MAX_STORAGE_PER_CREATOR_MB,
    raffleEntries: { daily: 0, weekly: 0, monthly: 0 }
  },
  socialLinks: {
    youtube: 'https://youtube.com/@exaltedvenus',
    tiktok: 'https://tiktok.com/@exaltedvenus',
    instagram: 'https://instagram.com/exaltedvenus'
  }
};

export const EXALTED_VENUS_PRODUCTS: DigitalProduct[] = [
  {
    id: 'p-natal-full',
    name: 'Natalna karta + Godišnji',
    description: 'Životni horoskop (45 min uživo). Potrebni datum, vreme i mesto rođenja.',
    price: 120.00,
    type: 'CONSULTATION',
    imageUrl: 'https://images.unsplash.com/photo-1515940175183-6798529cb860?w=400&q=80'
  },
  {
    id: 'p-tarot-20',
    name: 'Tarot uživo (20 min)',
    description: 'Brzi video poziv za konkretna pitanja.',
    price: 65.00,
    type: 'TAROT_READING',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80'
  },
  {
    id: 'ebook-planer-2025',
    name: 'Astrološki Planer 2025 (PDF)',
    description: 'Instant download: Detaljan vodič kroz tranzite za celu godinu.',
    price: 25.00,
    type: 'EBOOK',
    imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&q=80',
    externalLink: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' // Test PDF link
  }
];

const names = ["Milica Petrovic", "Marko Jovanovic", "Jelena Nikolic", "Stefan Kostic", "Ana Djordjevic"];
export const MOCK_FOLLOWERS: User[] = names.map((name, i) => ({
  id: `user-${100 + i}`,
  username: slugify(name),
  displayName: name,
  avatar: `https://i.pravatar.cc/150?u=user${100 + i}`,
  bio: "Pratilac",
  role: 'FOLLOWER',
  isVerified: false,
  paymentMethods: { isVerified: false },
  stats: { followersCount: 0, followingCount: 1, storageUsed: 0, maxStorage: 5120 }
}));

export const MOCK_FOLLOWER = MOCK_FOLLOWERS[0];
export const ALL_USERS = [EXALTED_VENUS, ...MOCK_FOLLOWERS];
export const MOCK_CREATORS = [EXALTED_VENUS];
export const MOCK_EXTENDED_VIDEOS: ExtendedVideo[] = [];
export const MOCK_TRANSACTIONS: Transaction[] = [];
export const MOCK_RAFFLE_SESSIONS: RaffleSession[] = [];
export const CATEGORIES = [{ id: 'astro', name: 'Astrologija & Tarot', icon: '🔮' }];
