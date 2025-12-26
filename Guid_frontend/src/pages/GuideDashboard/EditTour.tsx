import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import Button from '../../components/ui/button/Button';
import ComponentCard from '../../components/common/ComponentCard';
import FileInput from '../../components/form/input/FileInput';
import InputField from '../../components/form/input/InputField';
import Label from '../../components/form/Label';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import PageMeta from '../../components/common/PageMeta';
import Select from '../../components/form/Select';
import TextArea from '../../components/form/input/TextArea';
import { useTour } from '../../context/TourContext';

interface TourFormData {
  title: string;
  description: string;
  price: string;
  durationValue: string;
  durationUnit: string;
  location: string;
  itinerary: string;
  inclusions: string;
  exclusions: string;
  maxParticipants: string;
  difficulty: string;
  category: string;
}

const EditTour: React.FC = () => {
  const { tourId } = useParams<{ tourId: string }>();
  const navigate = useNavigate();
  const { updateTour } = useTour();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  const initialCategories = [
    { value: 'Adventure', label: 'Adventure' },
    { value: 'Cultural', label: 'Cultural' },
    { value: 'Nature', label: 'Nature' },
    { value: 'City', label: 'City' },
    { value: 'Beach', label: 'Beach' },
    { value: 'Mountain', label: 'Mountain' },
    { value: 'Historical', label: 'Historical' },
    { value: 'Food', label: 'Food' },
    { value: 'Other', label: 'Other' },
  ];

  const [categories, setCategories] = useState(initialCategories);
  const [newCategory, setNewCategory] = useState('');
  const [showAddNew, setShowAddNew] = useState(false);

  const [formData, setFormData] = useState<TourFormData>({
    title: '',
    description: '',
    price: '',
    durationValue: '',
    durationUnit: 'days',
    location: '',
    itinerary: '',
    inclusions: '',
    exclusions: '',
    maxParticipants: '',
    difficulty: 'Moderate',
    category: 'Other',
  });

  useEffect(() => {
    const fetchTour = async () => {
      if (!tourId) return;

      try {
        const token = localStorage.getItem('guideToken');
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/guide/tours/my-tours`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const tour = data.tours.find((t: any) => t._id === tourId);
          if (tour) {
            // Parse duration
            const durationParts = tour.duration.split(' ');
            const durationValue = durationParts[0];
            const durationUnit = durationParts[1] || 'days';

            setFormData({
              title: tour.title || '',
              description: tour.description || '',
              price: tour.price?.toString() || '',
              durationValue,
              durationUnit,
              location: tour.location || '',
              itinerary: tour.itinerary || '',
              inclusions: tour.inclusions || '',
              exclusions: tour.exclusions || '',
              maxParticipants: tour.maxParticipants?.toString() || '',
              difficulty: tour.difficulty || 'Moderate',
              category: tour.category || 'Other',
            });
            setExistingImages(tour.images || []);

            // Add tour's category to categories list if not already present
            if (tour.category && !categories.some(cat => cat.value === tour.category)) {
              setCategories(prev => [...prev, { value: tour.category, label: tour.category }]);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching tour:', error);
        alert('Failed to load tour data');
      } finally {
        setFetchLoading(false);
      }
    };

    fetchTour();
  }, [tourId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string) => (value: string) => {
    if (name === 'category' && value === 'add-new') {
      setShowAddNew(true);
      return;
    }
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(prev => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const addNewCategory = () => {
    if (newCategory.trim() && !categories.some(cat => cat.value === newCategory.trim())) {
      const newCat = { value: newCategory.trim(), label: newCategory.trim() };
      setCategories(prev => [...prev, newCat]);
      setFormData(prev => ({ ...prev, category: newCategory.trim() }));
      setNewCategory('');
      setShowAddNew(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('handleSubmit called');
    setLoading(true);

    if (images.length === 0 && existingImages.length === 0) {
      alert('Please upload at least one image');
      setLoading(false);
      return;
    }

    if (!formData.durationValue?.trim()) {
      alert('Please enter a duration value');
      setLoading(false);
      return;
    }

    const formDataToSend = new FormData();

    // Add form fields
    for (const [key, value] of Object.entries(formData)) {
      if (key === 'durationValue') {
        // Combine duration value and unit
        const duration = `${formData.durationValue} ${formData.durationUnit}`;
        formDataToSend.append('duration', duration);
        console.log('Duration:', duration);
      } else if (key !== 'durationUnit') {
        // Skip durationUnit as it's already combined
        formDataToSend.append(key, value);
        console.log(`${key}:`, value);
      }
    }

    // Add images
    for (const image of images) {
      formDataToSend.append('images', image);
      console.log('Image:', image.name);
    }

    console.log('FormData entries:');
    for (const [key, value] of formDataToSend.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      console.log('Submitting tour update form...');
      const result = await updateTour(tourId!, formDataToSend);
      console.log('Update tour result:', result);

      if (result.success) {
        console.log('Update successful, navigating to /tours/manage');
        console.log('Result:', result);
        alert('Update successful! Navigating to tours list...');
        // Try navigate with a small delay
        setTimeout(() => {
          navigate('/tours/manage', { replace: true });
        }, 100);
      } else {
        console.log('Update failed:', result.message);
        alert(`Tour update failed: ${result.message}`);
      }
    } catch (error) {
      console.error('Unexpected error in handleSubmit:', error);
      alert(`Unexpected error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const difficultyOptions = [
    { value: 'Easy', label: 'Easy' },
    { value: 'Moderate', label: 'Moderate' },
    { value: 'Challenging', label: 'Challenging' },
    { value: 'Expert', label: 'Expert' },
  ];

  const categoryOptions = [
    ...categories,
    { value: 'add-new', label: '+ Add New Category' },
  ];

  return (
    <>
      <PageMeta
        title="Edit Tour | GuideBeeLK Guide"
        description="Edit your tour details and images"
      />
      <PageBreadcrumb pageTitle="Edit Tour" />

      <div className="grid grid-cols-1 gap-6">
        <ComponentCard title="Tour Information">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="title">Tour Title *</Label>
                <InputField
                  type="text"
                  name="title"
                  id="title"
                  placeholder="Enter tour title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>

              <div>
                <Label htmlFor="price">Price (USD) *</Label>
                <InputField
                  type="number"
                  name="price"
                  id="price"
                  placeholder="Enter price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  step={0.01}
                  className="w-full"
                />
              </div>

              <div>
                <Label htmlFor="duration">Duration *</Label>
                <div className="flex gap-2">
                  <InputField
                    type="number"
                    name="durationValue"
                    id="durationValue"
                    placeholder="e.g., 3"
                    value={formData.durationValue}
                    onChange={handleInputChange}
                    min="1"
                    className="flex-1"
                  />
                  <Select
                    options={[
                      { value: 'days', label: 'Days' },
                      { value: 'weeks', label: 'Weeks' },
                      { value: 'months', label: 'Months' },
                    ]}
                    placeholder="Unit"
                    onChange={handleSelectChange('durationUnit')}
                    defaultValue={formData.durationUnit}
                    className="w-24"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="location">Location *</Label>
                <InputField
                  type="text"
                  name="location"
                  id="location"
                  placeholder="Enter tour location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>

              <div>
                <Label>Difficulty Level</Label>
                <Select
                  options={difficultyOptions}
                  placeholder="Select difficulty"
                  onChange={handleSelectChange('difficulty')}
                  defaultValue={formData.difficulty}
                  className="w-full"
                />
              </div>

              <div>
                <Label>Category</Label>
                <Select
                  options={categoryOptions}
                  placeholder="Select category"
                  onChange={handleSelectChange('category')}
                  defaultValue={formData.category}
                  className="w-full"
                />
                {showAddNew && (
                  <div className="mt-2 flex gap-2">
                    <InputField
                      type="text"
                      placeholder="Enter new category"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      onClick={addNewCategory}
                      className="px-4 py-2"
                    >
                      Add
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowAddNew(false)}
                      className="px-4 py-2"
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="maxParticipants">Maximum Participants</Label>
                <InputField
                  type="number"
                  name="maxParticipants"
                  id="maxParticipants"
                  placeholder="Enter max participants (optional)"
                  value={formData.maxParticipants}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <TextArea
                placeholder="Describe your tour in detail..."
                value={formData.description}
                onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
                className="w-full"
              />
            </div>

            <div>
              <Label htmlFor="itinerary">Itinerary</Label>
              <TextArea
                placeholder="Describe the day-by-day itinerary..."
                value={formData.itinerary}
                onChange={(value) => setFormData(prev => ({ ...prev, itinerary: value }))}
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="inclusions">What's Included</Label>
                <TextArea
                  placeholder="List what's included in the tour..."
                  value={formData.inclusions}
                  onChange={(value) => setFormData(prev => ({ ...prev, inclusions: value }))}
                  className="w-full"
                />
              </div>

              <div>
                <Label htmlFor="exclusions">What's Excluded</Label>
                <TextArea
                  placeholder="List what's not included..."
                  value={formData.exclusions}
                  onChange={(value) => setFormData(prev => ({ ...prev, exclusions: value }))}
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="tourImages">Tour Images * (Upload additional images)</Label>

              {existingImages.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Current Images ({existingImages.length}):
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {existingImages.map((image, index) => (
                      <div key={`existing-${index}`} className="relative">
                        <img
                          src={`${import.meta.env.VITE_API_URL}${image}`}
                          alt={`Current ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                        <span className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                          Current
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Upload new images to add them. Current images will be kept unless you contact support to remove them.
                  </p>
                </div>
              )}

              <FileInput
                onChange={handleFileChange}
                multiple
                accept="image/*"
              />
              {images.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    New Images ({images.length}):
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                      <div key={`${image.name}-${index}`} className="relative">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Tour ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={loading}
                className="px-6 py-3"
              >
                {loading ? 'Updating Tour...' : 'Update Tour'}
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/tours/manage')}
                className="px-6 py-3"
              >
                Cancel
              </Button>
            </div>
          </form>
        </ComponentCard>
      </div>
    </>
  );
};

export default EditTour;