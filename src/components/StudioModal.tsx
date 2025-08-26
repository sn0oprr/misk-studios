'use client';

import { useState, useEffect } from 'react';
import { Studio, StudioFormData, StudioCategory, EquipmentOption } from '@/types';

interface StudioModalProps {
  studio?: Studio | null;
  onClose: () => void;
  onSubmit: (data: StudioFormData) => Promise<void>;
}

const STUDIO_CATEGORIES: StudioCategory[] = [
  'Podcast',
  'Enregistrement',
  'Streaming',
  'Production'
];

const StudioModal = ({ studio, onClose, onSubmit }: StudioModalProps) => {
  const [formData, setFormData] = useState<StudioFormData>({
    name: '',
    area: 0,
    category: 'Podcast',
    description: '',
    images: [],
    equipment: [],
    price: 0,
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableEquipments, setAvailableEquipments] = useState<EquipmentOption[]>([]);
  const [equipmentsLoading, setEquipmentsLoading] = useState(true);

  const [uploadingImages, setUploadingImages] = useState<number[]>([]);

  const isEditing = !!studio;

  // Fetch available equipments
  useEffect(() => {
    const fetchEquipments = async () => {
      try {
        setEquipmentsLoading(true);
        const response = await fetch('/api/equipments');
        
        if (!response.ok) {
          throw new Error('Failed to fetch equipments');
        }
        
        const equipments = await response.json();
        setAvailableEquipments(equipments);
      } catch (err) {
        console.error('Error fetching equipments:', err);
        setError('Failed to load equipments');
      } finally {
        setEquipmentsLoading(false);
      }
    };

    fetchEquipments();
  }, []);

  // Set form data when editing
  useEffect(() => {
    if (studio) {
      setFormData({
        name: studio.name,
        area: studio.area,
        category: studio.category,
        description: studio.description,
        images: studio.images,
        equipment: studio.equipment.map(eq => {
          // Try to parse as number, fallback to finding by name
          const id = parseInt(eq);
          if (!isNaN(id)) return id;
          
          // Find equipment by name for backwards compatibility
          const found = availableEquipments.find(e => e.name === eq);
          return found ? found.id : 0;
        }).filter(id => id > 0),
        price: studio.price,
      });
    }
  }, [studio, availableEquipments]);

  const handleInputChange = (field: keyof StudioFormData, value: string | number | string[] | number[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error when user starts typing
    if (error) {
      setError(null);
    }
  };



  const handleImageUpload = async (files: FileList | null) => {
    if (!files) return;

    // Filter only image files
    const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      setError('Veuillez sélectionner des fichiers image valides');
      return;
    }

    try {
      setUploadingImages(prev => [...prev, ...imageFiles.map((_, index) => index)]);

      // Create FormData for upload
      const formData = new FormData();
      imageFiles.forEach(file => {
        formData.append('images', file);
      });

      // Upload images to server
      const response = await fetch('/api/upload/images', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload images');
      }

      const { urls } = await response.json();

      // Add uploaded URLs to form data
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...urls],
      }));

      setUploadingImages([]);
    } catch (err: any) {
      console.error('Error uploading images:', err);
      setError(err.message || 'Failed to upload images');
      setUploadingImages([]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleEquipmentSelection = (equipmentId: number, isSelected: boolean) => {
    setFormData(prev => ({
      ...prev,
      equipment: isSelected 
        ? [...prev.equipment, equipmentId]
        : prev.equipment.filter(id => id !== equipmentId),
    }));
  };

  const isEquipmentSelected = (equipmentId: number) => {
    return formData.equipment.includes(equipmentId);
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError('Le nom du studio est requis');
      return false;
    }
    
    if (!formData.description.trim()) {
      setError('La description est requise');
      return false;
    }
    
    if (formData.area <= 0) {
      setError('La superficie doit être supérieure à 0');
      return false;
    }
    
    if (!formData.price || formData.price <= 0) {
      setError('Le prix /hr doit être un nombre positif');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      await onSubmit(formData);
      
      // Reset form
      setFormData({
        name: '',
        area: 0,
        category: 'Podcast',
        description: '',
        images: [],
        equipment: [],
        price: 0,
      });
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 p-4 opacity-0 animate-fade-in"
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
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 font-sf">
            {isEditing ? 'Modifier le studio' : 'Nouveau studio'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Fermer"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            </div>
          )}

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name Field */}
            <div>
              <label htmlFor="studio-name" className="block text-sm font-medium text-gray-700 mb-2">
                Nom du studio *
              </label>
              <input
                id="studio-name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Ex: Studio Podcast Pro"
                required
              />
            </div>

            {/* Category Field */}
            <div>
              <label htmlFor="studio-category" className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie *
              </label>
              <select
                id="studio-category"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value as StudioCategory)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                required
              >
                {STUDIO_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Area Field */}
            <div>
              <label htmlFor="studio-area" className="block text-sm font-medium text-gray-700 mb-2">
                Superficie (m²) *
              </label>
              <input
                id="studio-area"
                type="number"
                min="1"
                value={formData.area || ''}
                onChange={(e) => handleInputChange('area', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Ex: 25"
                required
              />
            </div>

            {/* Price Field */}
            <div>
              <label htmlFor="studio-price" className="block text-sm font-medium text-gray-700 mb-2">
                Prix /hr *
              </label>
              <input
                id="studio-price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Ex: 150.00"
                required
              />
            </div>
          </div>

          {/* Description Field */}
          <div>
            <label htmlFor="studio-description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="studio-description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
              placeholder="Description détaillée du studio"
              required
            />
          </div>

          {/* Images Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Images
            </label>
            <div className="space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block w-full">
                  <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                    uploadingImages.length > 0 
                      ? 'border-yellow-400 bg-yellow-50' 
                      : 'border-gray-300 hover:border-yellow-400'
                  }`}>
                    {uploadingImages.length > 0 ? (
                      <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600 mb-2"></div>
                        <p className="text-sm text-yellow-700">Téléchargement en cours...</p>
                        <p className="text-xs text-yellow-600">{uploadingImages.length} image(s)</p>
                      </div>
                    ) : (
                      <>
                        <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium text-yellow-600">Cliquez pour télécharger</span> ou glissez-déposez
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF jusqu'à 10MB</p>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files)}
                    className="hidden"
                    disabled={uploadingImages.length > 0}
                  />
                </label>
              </div>



              {/* Image Preview */}
              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={image as string}
                          alt={`Studio image ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/images/placeholder-image.jpg';
                          }}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Equipment Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Équipements ({formData.equipment.length} sélectionné(s))
            </label>
            {equipmentsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-600"></div>
                <span className="ml-2 text-gray-500">Chargement des équipements...</span>
              </div>
            ) : (
              <div className="border border-gray-300 rounded-lg max-h-48 overflow-y-auto">
                {availableEquipments.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <p>Aucun équipement disponible</p>
                    <p className="text-xs">Créez d'abord des équipements</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {availableEquipments.map((equipment) => (
                      <label
                        key={equipment.id}
                        className="flex items-center p-3 hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={isEquipmentSelected(equipment.id)}
                          onChange={(e) => handleEquipmentSelection(equipment.id, e.target.checked)}
                          className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                        />
                        <div className="ml-3 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-900">
                              {equipment.name}
                            </span>
                            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                              {equipment.type}
                            </span>
                          </div>
                          {equipment.description && (
                            <p className="text-xs text-gray-500 mt-1">
                              {equipment.description}
                            </p>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              <span>
                {loading 
                  ? (isEditing ? 'Modification...' : 'Création...') 
                  : (isEditing ? 'Modifier' : 'Créer')
                }
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudioModal;
