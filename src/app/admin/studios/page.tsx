'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import StudioModal from '@/components/StudioModal';
import { Studio, StudioFormData } from '@/types';

const StudiosPage = () => {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudio, setEditingStudio] = useState<Studio | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchStudios = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/studios');
      
      if (!response.ok) {
        throw new Error('Failed to fetch studios');
      }
      
      const data = await response.json();
      setStudios(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching studios:', err);
      setError('Failed to load studios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudios();
  }, []);

  const handleCreateStudio = () => {
    setEditingStudio(null);
    setIsModalOpen(true);
  };

  const handleEditStudio = (studio: Studio) => {
    setEditingStudio(studio);
    setIsModalOpen(true);
  };

  const handleDeleteStudio = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce studio ?')) {
      return;
    }

    try {
      setDeletingId(id);
      const response = await fetch(`/api/admin/studios/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete studio');
      }

      await fetchStudios();
    } catch (err) {
      console.error('Error deleting studio:', err);
      setError('Failed to delete studio');
    } finally {
      setDeletingId(null);
    }
  };

  const handleModalSubmit = async (formData: StudioFormData) => {
    try {
      const url = editingStudio 
        ? `/api/admin/studios/${editingStudio.id}`
        : '/api/admin/studios';
      
      const method = editingStudio ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save studio');
      }

      await fetchStudios();
      setIsModalOpen(false);
      setEditingStudio(null);
    } catch (err) {
      console.error('Error saving studio:', err);
      throw err; // Let the modal handle the error display
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Podcast': 'bg-blue-100 text-blue-800',
      'Enregistrement': 'bg-green-100 text-green-800',
      'Streaming': 'bg-purple-100 text-purple-800',
      'Production': 'bg-orange-100 text-orange-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <AdminLayout>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
          </div>
        </AdminLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-lg p-6 text-black">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-2 font-sf">
                  Gestion des Studios
                </h1>
                <p className="text-black/80">
                  Gérez vos studios d'enregistrement et leurs configurations
                </p>
              </div>
              <button
                onClick={handleCreateStudio}
                className="bg-black text-yellow-400 px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Nouveau Studio</span>
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-red-700">{error}</span>
              </div>
            </div>
          )}

          {/* Studios Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 font-sf">
                  Liste des Studios ({studios.length})
                </h3>
              </div>
            </div>

            {studios.length === 0 ? (
              <div className="p-12 text-center">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <p className="text-gray-500 mb-4">Aucun studio trouvé</p>
                <button
                  onClick={handleCreateStudio}
                  className="bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-yellow-700 transition-colors"
                >
                  Créer le premier studio
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nom
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Catégorie
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Superficie
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Prix
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Équipements
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date de création
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {studios.map((studio) => (
                      <tr key={studio.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {studio.name}
                          </div>
                          <div className="text-sm text-gray-500 max-w-xs truncate">
                            {studio.description}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(studio.category)}`}>
                            {studio.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {studio.area} m²
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {studio.price}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {studio.equipment.length} équipement(s)
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(studio.createdAt).toLocaleDateString('fr-FR')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleEditStudio(studio)}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded"
                              title="Modifier"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteStudio(studio.id)}
                              disabled={deletingId === studio.id}
                              className="text-red-600 hover:text-red-900 p-1 rounded disabled:opacity-50"
                              title="Supprimer"
                            >
                              {deletingId === studio.id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                              ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Studio Modal */}
        {isModalOpen && (
          <StudioModal
            studio={editingStudio}
            onClose={() => {
              setIsModalOpen(false);
              setEditingStudio(null);
            }}
            onSubmit={handleModalSubmit}
          />
        )}
      </AdminLayout>
    </ProtectedRoute>
  );
};

export default StudiosPage;
