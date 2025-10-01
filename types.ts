export interface Category {
  id: number;
  name: string;
  icon: string;
}

export interface ServiceAddon {
  id: string;
  name: string;
  description: string;
  price: number;
  deliveryDays: number;
  ownership: 'exclusive' | 'non-exclusive';
}

export interface ServiceVideo {
  id: string;
  url: string; // Base64 data URL
  name: string;
  uploadedAt: number;
}

export interface Service {
  id: number;
  name: string;
  shortDescription: string;
  longDescription: string;
  features: string[];
  price: string;
  currency: string;
  imageUrls: string[];
  videoUrls?: ServiceVideo[];
  location: string;
  author: string;
  createdAt: number;
  isFeatured?: boolean;
  categoryIds: number[];
  addons?: ServiceAddon[];
}

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

export interface ServiceSuggestion {
    id?: number;
    name: string;
    requestedAt: number;
}
