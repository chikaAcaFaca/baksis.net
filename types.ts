
export type UserRole = 'CREATOR' | 'FOLLOWER' | 'ADMIN';

export interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  benefits: string[];
  color: string;
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

export interface ExtendedVideo {
  id: string;
  creatorId: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  thumbnailUrl: string;
  videoUrl: string; 
  isExtended: boolean;
  raffleEntriesGranted: number;
}
// ... ostali tipovi ostaju isti
