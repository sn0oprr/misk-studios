import { Studio } from '@/types';

export const studios: Studio[] = [
  {
    id: 'studio-podcast-1',
    nom: 'Studio Podcast Pro',
    superficie: 25,
    categorie: 'Podcast',
    description: 'Studio professionnel parfait pour l\'enregistrement de podcasts avec une acoustique optimisée et un équipement de pointe.',
    images: [
      'https://picsum.photos/seed/podcast1/800/600',
      'https://picsum.photos/seed/podcast2/800/600',
      'https://picsum.photos/seed/podcast3/800/600'
    ],
    equipements: [
      'Microphones Shure SM7B',
      'Interface audio Focusrite',
      'Casques de monitoring',
      'Traitement acoustique professionnel',
      'Éclairage LED réglable'
    ],
    prix: 'À partir de 50 DT/heure'
  },
  {
    id: 'studio-enregistrement-1',
    nom: 'Studio Enregistrement Elite',
    superficie: 40,
    categorie: 'Enregistrement',
    description: 'Grand studio d\'enregistrement avec cabine d\'isolation pour musiciens et artistes vocaux. Idéal pour les productions musicales.',
    images: [
      'https://picsum.photos/seed/recording1/800/600',
      'https://picsum.photos/seed/recording2/800/600',
      'https://picsum.photos/seed/recording3/800/600'
    ],
    equipements: [
      'Console de mixage SSL',
      'Microphones Neumann',
      'Moniteurs de studio Genelec',
      'Cabine d\'isolation acoustique',
      'Clavier MIDI 88 touches',
      'Batterie électronique'
    ],
    prix: 'À partir de 80 DT/heure'
  },
  {
    id: 'studio-streaming-1',
    nom: 'Studio Streaming Live',
    superficie: 30,
    categorie: 'Streaming',
    description: 'Studio moderne équipé pour le streaming en direct et la création de contenu vidéo avec un setup multi-caméras.',
    images: [
      'https://picsum.photos/seed/streaming1/800/600',
      'https://picsum.photos/seed/streaming2/800/600',
      'https://picsum.photos/seed/streaming3/800/600'
    ],
    equipements: [
      'Caméras 4K professionnelles',
      'Éclairage LED multi-couleurs',
      'Green screen motorisé',
      'Régie de streaming',
      'Connexion internet haut débit',
      'Prompteur télé'
    ],
    prix: 'À partir de 70 DT/heure'
  },
  {
    id: 'studio-production-1',
    nom: 'Studio Production Créative',
    superficie: 35,
    categorie: 'Production',
    description: 'Espace polyvalent pour la post-production, le montage vidéo et audio, avec des stations de travail haute performance.',
    images: [
      'https://picsum.photos/seed/production1/800/600',
      'https://picsum.photos/seed/production2/800/600',
      'https://picsum.photos/seed/production3/800/600'
    ],
    equipements: [
      'Stations Pro Tools HDX',
      'Moniteurs de référence',
      'iMac Pro 27"',
      'Adobe Creative Suite',
      'Surface de contrôle Avid',
      'Stockage RAID haute vitesse'
    ],
    prix: 'À partir de 60 DT/heure'
  }
];
