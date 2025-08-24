'use client';

import Image from 'next/image';
import { Studio } from '@/types';

interface StudioCardProps {
  studio: Studio;
  onReserve: (studio: Studio) => void;
}

export default function StudioCard({ studio, onReserve }: StudioCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-48 w-full">
        <Image
          src={studio.images[0]}
          alt={`${studio.nom} - Studio ${studio.categorie}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-2 right-2">
          <span className="px-2 py-1 bg-black text-white text-xs font-medium rounded-full">
            {studio.categorie}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 font-sf">{studio.nom}</h3>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-600">
            Superficie: {studio.superficie}m²
          </span>
          <span className="text-sm font-medium" style={{color: '#fada00'}}>
            {studio.prix}
          </span>
        </div>
        
        <p className="text-gray-700 text-sm mb-4 line-clamp-3">
          {studio.description}
        </p>
        
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Équipements:</h4>
          <div className="flex flex-wrap gap-1">
            {studio.equipements.slice(0, 3).map((equipement, index) => (
              <span
                key={index}
                className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
              >
                {equipement}
              </span>
            ))}
            {studio.equipements.length > 3 && (
              <span className="text-xs text-gray-500">
                +{studio.equipements.length - 3} autres
              </span>
            )}
          </div>
        </div>
        
        <button
          onClick={() => onReserve(studio)}
          className="w-full text-black font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 font-montserrat"
          style={{backgroundColor: '#fada00'}}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e8c400'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fada00'}
        >
          Réserver
        </button>
      </div>
    </div>
  );
}
