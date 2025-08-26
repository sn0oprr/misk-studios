'use client';

import { useEffect, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { BookingWithStudioInfo } from '@/types';

interface BookingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: number | null;
  onDelete: (bookingId: number) => void;
}

export default function BookingDetailsModal({ 
  isOpen, 
  onClose, 
  bookingId, 
  onDelete 
}: BookingDetailsModalProps) {
  const [booking, setBooking] = useState<BookingWithStudioInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch booking details when modal opens
  useEffect(() => {
    if (isOpen && bookingId) {
      fetchBookingDetails();
    }
  }, [isOpen, bookingId]);

  const fetchBookingDetails = async () => {
    if (!bookingId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/admin/bookings/${bookingId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch booking details');
      }
      
      const data = await response.json();
      setBooking(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load booking details');
    } finally {
      setLoading(false);
    }
  };

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

  const handleDelete = async () => {
    if (!booking || !bookingId) return;
    
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la réservation de ${booking.firstName} ${booking.lastName} ?`)) {
      try {
        setDeleteLoading(true);
        
        const response = await fetch(`/api/admin/bookings/${bookingId}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete booking');
        }
        
        onDelete(bookingId);
        onClose();
      } catch (err: any) {
        setError(err.message || 'Failed to delete booking');
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;

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
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform scale-95 translate-y-4 opacity-0"
        style={{
          animation: 'modalSlideIn 0.2s ease-out 0.1s forwards'
        }}
      >
        <div className="relative p-6">
          <div className="absolute right-0 top-0 pr-4 pt-4">
            <button
              type="button"
              className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
              onClick={onClose}
            >
              <span className="sr-only">Fermer</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="pr-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Détails de la Réservation
            </h3>

            {loading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
                <span className="ml-3 text-gray-600">Chargement...</span>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {booking && !loading && (
              <div className="space-y-6">
                {/* Client Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-md font-medium text-gray-900 mb-3">Informations Client</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nom complet</label>
                      <p className="text-sm text-gray-900">{booking.firstName} {booking.lastName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="text-sm text-gray-900">
                        <a href={`mailto:${booking.email}`} className="text-blue-600 hover:text-blue-800">
                          {booking.email}
                        </a>
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                      <p className="text-sm text-gray-900">
                        <a href={`tel:${booking.phone}`} className="text-blue-600 hover:text-blue-800">
                          {booking.phone}
                        </a>
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Ville</label>
                      <p className="text-sm text-gray-900">{booking.city}</p>
                    </div>
                  </div>
                </div>

                {/* Studio Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-md font-medium text-gray-900 mb-3">Studio Demandé</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nom du studio</label>
                      <p className="text-sm text-gray-900">{booking.studioName || 'Studio supprimé'}</p>
                    </div>
                    {booking.studioCategory && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Catégorie</label>
                        <p className="text-sm text-gray-900">{booking.studioCategory}</p>
                      </div>
                    )}
                    {booking.studioArea && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Superficie</label>
                        <p className="text-sm text-gray-900">{booking.studioArea} m²</p>
                      </div>
                    )}
                    {booking.studioPrice && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Prix /hr</label>
                        <p className="text-sm text-gray-900">
                          {(typeof booking.studioPrice === 'number' ? booking.studioPrice : parseFloat(booking.studioPrice) || 0).toFixed(2)} TND/heure
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Message */}
                {booking.message && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-md font-medium text-gray-900 mb-3">Message</h4>
                    <p className="text-sm text-gray-900 whitespace-pre-wrap">{booking.message}</p>
                  </div>
                )}

                {/* Booking Metadata */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-md font-medium text-gray-900 mb-3">Informations de Réservation</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Date de demande</label>
                      <p className="text-sm text-gray-900">{formatDate(booking.createdAt.toString())}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">ID de réservation</label>
                      <p className="text-sm text-gray-900">#{booking.id}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    onClick={onClose}
                  >
                    Fermer
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleDelete}
                    disabled={deleteLoading}
                  >
                    {deleteLoading ? 'Suppression...' : 'Supprimer'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
