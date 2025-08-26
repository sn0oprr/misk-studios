'use client';

import { useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { Studio } from '@/types';
import { BookingFormData, bookingFormSchema } from '@/lib/validations';
import PhotoGallery from './PhotoGallery';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  studio: Studio | null;
}

export default function BookingModal({ isOpen, onClose, studio }: BookingModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
  });

  // Set studio info when modal opens
  useEffect(() => {
    if (studio) {
      setValue('studioId', studio.id);
      setValue('studioNom', studio.name);
    }
  }, [studio, setValue]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const onSubmit = async (data: BookingFormData) => {
    try {
      const response = await fetch('/api/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi de la demande');
      }

      toast.success('Votre demande de réservation a été envoyée avec succès !');
      onClose();
      reset();
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Une erreur est survenue. Veuillez réessayer.');
    }
  };

  if (!studio || !isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 p-4 opacity-0"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      style={{
        animation: 'fadeIn 0.2s ease-out forwards'
      }}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto transform scale-95 translate-y-4 opacity-0"
        style={{
          animation: 'modalSlideIn 0.2s ease-out 0.1s forwards'
        }}
      >
        <div className="relative px-4 pb-4 pt-5 sm:p-6">
          <div className="absolute right-0 top-0 pr-4 pt-4">
            <button
              type="button"
              className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              onClick={onClose}
            >
              <span className="sr-only">Fermer</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Studio Info */}
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                {studio.name}
              </h3>
              
              <PhotoGallery images={studio.images} alt={studio.name} />
              
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Catégorie:</span>
                  <span className="px-2 py-1 bg-yellow-100 text-sm rounded" style={{color: '#fada00'}}>
                    {studio.category}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Superficie:</span>
                  <span className="text-sm font-medium">{studio.area}m²</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Prix:</span>
                  <span className="text-sm font-medium" style={{color: '#fada00'}}>{studio.price}</span>
                </div>
              </div>
              
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Description:</h4>
                <p className="text-sm text-gray-700">{studio.description}</p>
              </div>
              
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Équipements:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  {studio.equipment.map((equipement, index) => (
                    <li key={index} className="flex items-center">
                      <span className="w-2 h-2 rounded-full mr-2 flex-shrink-0" style={{backgroundColor: '#fada00'}}></span>
                      {equipement}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Column - Booking Form */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">
                Demande de réservation
              </h4>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="prenom" className="block text-sm font-medium text-gray-700 mb-1">
                            Prénom *
                          </label>
                          <input
                            type="text"
                            id="prenom"
                            {...register('prenom')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                            placeholder="Votre prénom"
                          />
                          {errors.prenom && (
                            <p className="mt-1 text-sm text-red-600">{errors.prenom.message}</p>
                          )}
                        </div>

                        <div>
                          <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">
                            Nom *
                          </label>
                          <input
                            type="text"
                            id="nom"
                            {...register('nom')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                            placeholder="Votre nom"
                          />
                          {errors.nom && (
                            <p className="mt-1 text-sm text-red-600">{errors.nom.message}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email *
                        </label>
                        <input
                          type="email"
                          id="email"
                          {...register('email')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                          placeholder="votre@email.com"
                        />
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-1">
                            Téléphone *
                          </label>
                          <input
                            type="tel"
                            id="telephone"
                            {...register('telephone')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                            placeholder="+216 XX XXX XXX"
                          />
                          {errors.telephone && (
                            <p className="mt-1 text-sm text-red-600">{errors.telephone.message}</p>
                          )}
                        </div>

                        <div>
                          <label htmlFor="ville" className="block text-sm font-medium text-gray-700 mb-1">
                            Ville *
                          </label>
                          <input
                            type="text"
                            id="ville"
                            {...register('ville')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                            placeholder="Tunis"
                          />
                          {errors.ville && (
                            <p className="mt-1 text-sm text-red-600">{errors.ville.message}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                          Message *
                        </label>
                        <textarea
                          id="message"
                          rows={4}
                          {...register('message')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
                          placeholder="Décrivez votre projet, dates souhaitées, durée..."
                        />
                        {errors.message && (
                          <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                        )}
                      </div>

                      <div className="flex space-x-3 pt-4">
                        <button
                          type="button"
                          className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400"
                          onClick={onClose}
                        >
                          Annuler
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="flex-1 rounded-md px-4 py-2 text-sm font-medium text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{backgroundColor: '#fada00'}}
                          onMouseEnter={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = '#e8c400')}
                          onMouseLeave={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = '#fada00')}
                        >
                          {isSubmitting ? 'Envoi...' : 'Envoyer la demande'}
                        </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
