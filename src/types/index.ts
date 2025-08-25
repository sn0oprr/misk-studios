export interface Studio {
  id: string;
  nom: string;
  superficie: number;
  categorie: 'Podcast' | 'Enregistrement' | 'Streaming' | 'Production';
  description: string;
  images: string[];
  equipements: string[];
  prix: string;
}

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
