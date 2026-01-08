
export type UserRole = 'CREATOR' | 'FOLLOWER' | 'ADMIN';

export interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  benefits: string[];
  color: string;
}

export interface SocialOrbitConfig {
  isConnected: boolean;
  platform: 'INSTAGRAM' | 'TIKTOK' | 'FACEBOOK' | 'X';
  lastPostDate?: string;
  isGrowthBoostActive: boolean;
  minutesUsed: number;
  minutesTotal: number;
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  banner?: string;
  bio: string;
  role: UserRole;
  isVerified: boolean;
  email?: string;
  phone_number?: string;
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
    growthMinutesUsed: number;
    growthMinutesTotal: number;
    raffleEntries?: {
      daily: number;
      weekly: number;
      monthly: number;
    };
  };
  youtubeConfig?: {
    channelId: string;
    handle: string;
    isConnected: boolean;
    lastSync?: Date;
  };
  socialOrbit?: SocialOrbitConfig[];
  subscriptionTiers?: SubscriptionTier[];
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
  type: 'TAROT_READING' | 'EBOOK' | 'SERVICE' | 'CONSULTATION' | 'EXTENDED_VIDEO' | 'FILE_DOWNLOAD' | 'SUBSCRIPTION';
  imageUrl?: string;
  externalLink?: string;
  fileSize?: number;
  fileName?: string;
}

export interface AIClippingSuggestion {
  id: string;
  startTime: string;
  endTime: string;
  duration: number;
  hook: string;
  captions: string;
  selectedRatio: '9:16' | '16:9';
  selectedRes: '720p' | '1080p';
  platformCaptions: {
    tiktok: string;
    instagram: string;
    x: string;
  };
}
