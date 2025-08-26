export interface Studio {
  id: string;
  name: string;
  area: number;
  category: 'Podcast' | 'Enregistrement' | 'Streaming' | 'Production';
  description: string;
  images: string[];
  equipment: string[];
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface StudioFormData {
  name: string;
  area: number;
  category: 'Podcast' | 'Enregistrement' | 'Streaming' | 'Production';
  description: string;
  images: string[];
  equipment: number[];
  price: number;
}

export interface EquipmentOption {
  id: number;
  name: string;
  type: string;
  description?: string;
}

export type StudioCategory = 'Podcast' | 'Enregistrement' | 'Streaming' | 'Production';

export interface BookingFormData {
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  ville: string;
  message: string;
  studioId: string;
  studioNom: string;
}

export interface Equipment {
  id: number;
  name: string;
  type: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EquipmentFormData {
  name: string;
  type: string;
  description: string;
}

export type EquipmentType = 
  | 'Audio'
  | 'Video'
  | 'Lighting'
  | 'Computer'
  | 'Recording'
  | 'Streaming'
  | 'Other';
