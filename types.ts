
export type UserRole = 'CREATOR' | 'FOLLOWER' | 'ADMIN';

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  role: UserRole;
  isVerified: boolean;
  email?: string;
  phone_number?: string; // Promenjeno iz phoneNumber u phone_number da odgovara bazi
  paymentMethods: {
    payoneerEmail?: string;
    payoneerId?: string;
    isVerified: boolean;
  };
  stats: {
    followersCount: number;
    followingCount: number;
    balance?: number;
    storageUsed: number;
    maxStorage: number;
    raffleEntries?: {
      daily: number;
      weekly: number;
      monthly: number;
    };
  };
  ownedVideos?: string[];
  socialLinks?: {
    youtube?: string;
    tiktok?: string;
    instagram?: string;
  };
  isInternalProject?: boolean;
}

export interface DigitalProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  type: 'TAROT_READING' | 'EBOOK' | 'SERVICE' | 'CONSULTATION' | 'EXTENDED_VIDEO' | 'FILE_DOWNLOAD';
  imageUrl?: string;
  externalLink?: string;
  fileSize?: number;
  fileName?: string;
}

export interface ExtendedVideo {
  id: string;
  creatorId: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  thumbnailUrl: string;
  videoUrl: string; 
  raffleEntriesGranted: number;
}

export type RafflePeriod = 'DAILY' | 'WEEKLY' | 'MONTHLY';

export interface RaffleSession {
  id: string;
  creatorId: string;
  period: RafflePeriod;
  status: 'ACTIVE' | 'COMPLETED';
  startDate: Date;
  endDate: Date;
  rewardDescription: string;
  rewardType: 'TAROT_READING' | 'DIGITAL_PRODUCT' | 'CONSULTATION';
  entries: { userId: string; count: number }[];
}

export interface Transaction {
  id: string;
  amount: number;
  fee: number;
  creatorId: string;
  followerId: string;
  timestamp: Date;
  status: 'COMPLETED' | 'PENDING';
  isInternal: boolean;
  productId?: string;
  productType?: 'VIDEO' | 'SUB' | 'TIP' | 'PRODUCT';
}

export interface Post {
  id: string;
  creatorId: string;
  type: 'IMAGE' | 'VIDEO' | 'TEXT';
  content: string;
  mediaUrl?: string;
  isPaid: boolean;
  price?: number;
  timestamp: Date;
  source?: 'YOUTUBE' | 'TIKTOK' | 'INSTAGRAM' | 'NATIVE';
}
