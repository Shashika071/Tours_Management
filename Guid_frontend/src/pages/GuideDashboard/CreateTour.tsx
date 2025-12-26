import React, { useState } from 'react';

import Button from '../../components/ui/button/Button';
import ComponentCard from '../../components/common/ComponentCard';
import FileInput from '../../components/form/input/FileInput';
import InputField from '../../components/form/input/InputField';
import Label from '../../components/form/Label';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import PageMeta from '../../components/common/PageMeta';
import Select from '../../components/form/Select';
import TextArea from '../../components/form/input/TextArea';
import { useNavigate } from 'react-router';
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

const CreateTour: React.FC = () => {
  const navigate = useNavigate();
  const { createTour } = useTour();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);

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
  const [successMessage, setSuccessMessage] = useState('');

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
    setLoading(true);

    if (images.length === 0) {
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
      console.log('Submitting tour creation form...');
      const result = await createTour(formDataToSend);
      console.log('Create tour result:', result);

      if (result.success) {
        console.log('Tour creation successful, showing message and navigating...');
        setSuccessMessage('Waiting for manager approval');
        setTimeout(() => {
          console.log('Navigating to /tours/manage');
          navigate('/tours/manage', { replace: true });
        }, 2000); // 2 seconds delay
      } else {
        alert(`Tour creation failed: ${result.message}`);
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
        title="Create Tour | Guide Dashboard"
        description="Create a new tour with detailed information and images"
      />
      <PageBreadcrumb pageTitle="Create Tour" />

      <div className="grid grid-cols-1 gap-6">
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {successMessage}
          </div>
        )}
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
              <Label htmlFor="tourImages">Tour Images * (Upload multiple images)</Label>
              <FileInput
                onChange={handleFileChange}
                multiple
                accept="image/*"
              />
              {images.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Selected Images ({images.length}):
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
                {loading ? 'Creating Tour...' : 'Create Tour'}
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/tours')}
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

export default CreateTour;