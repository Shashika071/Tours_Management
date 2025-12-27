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

interface BidTourFormData {
    title: string;
    description: string;
    startingPrice: string;
    bidEndDate: string;
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

const EditBidTour: React.FC = () => {
    const { tourId } = useParams<{ tourId: string }>();
    const navigate = useNavigate();
    const { updateTour, tours, pausePolling, resumePolling } = useTour();
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [images, setImages] = useState<File[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [currentTour, setCurrentTour] = useState<any>(null);

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

    const [formData, setFormData] = useState<BidTourFormData>({
        title: '',
        description: '',
        startingPrice: '',
        bidEndDate: '',
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

    // Pause polling while editing the form
    useEffect(() => {
        pausePolling();
        return () => resumePolling();
    }, [pausePolling, resumePolling]);

    useEffect(() => {
        const fetchTour = async () => {
            if (!tourId) return;

            try {
                // First try to find in local tours array
                let tour = tours.find(t => t._id === tourId);

                // If not found locally, fetch from API
                if (!tour) {
                    const token = localStorage.getItem('guideToken');
                    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/guide/tours/my-tours`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });

                    if (response.ok) {
                        const data = await response.json();
                        tour = data.tours.find((t: any) => t._id === tourId);
                    }
                }

                if (tour && tour.tourType === 'bid') {
                    setCurrentTour(tour);
                    const durationMatch = tour.duration.match(/^(\d+)\s+(\w+)$/);
                    const durationValue = durationMatch ? durationMatch[1] : '';
                    const durationUnit = durationMatch ? durationMatch[2] : 'days';

                    setFormData({
                        title: tour.title || '',
                        description: tour.description || '',
                        startingPrice: tour.bidDetails?.startingPrice?.toString() || '',
                        bidEndDate: tour.bidDetails?.bidEndDate ? new Date(tour.bidDetails.bidEndDate).toISOString().split('T')[0] : '',
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
            } catch (error) {
                console.error('Error fetching tour:', error);
            } finally {
                setFetchLoading(false);
            }
        };

        fetchTour();
    }, [tourId, categories]);

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
        console.log('handleSubmit called for bid tour');
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

        if (!formData.startingPrice || !formData.bidEndDate) {
            alert('Starting price and bid end date are required');
            setLoading(false);
            return;
        }

        // Validate starting price is a positive number
        const startingPriceNum = parseFloat(formData.startingPrice);
        if (isNaN(startingPriceNum) || startingPriceNum <= 0) {
            console.log('Invalid starting price:', formData.startingPrice, startingPriceNum);
            alert('Starting price must be a positive number');
            setLoading(false);
            return;
        }

        // Validate bid end date is in the future
        const bidEndDate = new Date(formData.bidEndDate);
        if (isNaN(bidEndDate.getTime()) || bidEndDate <= new Date()) {
            console.log('Invalid bid end date:', formData.bidEndDate, bidEndDate);
            alert('Bid end date must be in the future');
            setLoading(false);
            return;
        }

        const formDataToSend = new FormData();

        // Add form fields
        for (const [key, value] of Object.entries(formData)) {
            if (key === 'durationValue') {
                const duration = `${formData.durationValue} ${formData.durationUnit}`;
                formDataToSend.append('duration', duration);
            } else if (key !== 'durationUnit') {
                formDataToSend.append(key, value);
            }
        }

        // Explicitly set tourType
        formDataToSend.append('tourType', 'bid');

        // Add images
        for (const image of images) {
            formDataToSend.append('images', image);
        }

        try {
            const result = await updateTour(tourId!, formDataToSend);
            if (result.success) {
                setSuccessMessage('Bid tour updated successfully. Waiting for manager approval.');
                setTimeout(() => {
                    navigate('/tours/bid/manage');
                }, 2000);
            } else {
                alert(`Failed to update bid tour: ${result.message}`);
            }
        } catch (error) {
            console.error('Error in handleSubmit:', error);
            alert('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    if (fetchLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

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

    const isApproved = currentTour?.status === 'approved';

    return (
        <>
            <PageMeta
                title="Edit Bid Tour | Guide Dashboard"
                description="Edit your bid-based tour"
            />
            <PageBreadcrumb pageTitle="Edit Bid Tour" />

            <div className="grid grid-cols-1 gap-6">
                {successMessage && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                        {successMessage}
                    </div>
                )}
                <ComponentCard title="Edit Bid Tour Information">
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
                                <Label htmlFor="startingPrice">
                                    Starting Price (USD) * {isApproved && <span className="text-red-500">(Cannot be changed after approval)</span>}
                                </Label>
                                <InputField
                                    type="number"
                                    name="startingPrice"
                                    id="startingPrice"
                                    placeholder="Enter starting price"
                                    value={formData.startingPrice}
                                    onChange={handleInputChange}
                                    min="0"
                                    step={0.01}
                                    className="w-full"
                                    disabled={isApproved}
                                />
                            </div>

                            <div>
                                <Label htmlFor="bidEndDate">Bid End Date *</Label>
                                <InputField
                                    type="date"
                                    name="bidEndDate"
                                    id="bidEndDate"
                                    value={formData.bidEndDate}
                                    onChange={handleInputChange}
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
                                    <div className="flex gap-2 mt-2">
                                        <InputField
                                            type="text"
                                            placeholder="New category name"
                                            value={newCategory}
                                            onChange={(e) => setNewCategory(e.target.value)}
                                            className="flex-1"
                                        />
                                        <Button type="button" onClick={addNewCategory} className="px-4 py-2">
                                            Add
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="maxParticipants">Max Participants</Label>
                                <InputField
                                    type="number"
                                    name="maxParticipants"
                                    id="maxParticipants"
                                    placeholder="Enter max participants"
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
                                id="description"
                                placeholder="Enter tour description"
                                value={formData.description}
                                onChange={(value) => handleInputChange({ target: { name: 'description', value } })}
                                rows={4}
                                className="w-full"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label htmlFor="itinerary">Itinerary</Label>
                                <TextArea
                                    id="itinerary"
                                    placeholder="Enter tour itinerary"
                                    value={formData.itinerary}
                                    onChange={(value) => handleInputChange({ target: { name: 'itinerary', value } })}
                                    rows={3}
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <Label htmlFor="inclusions">Inclusions</Label>
                                <TextArea
                                    id="inclusions"
                                    placeholder="Enter what's included"
                                    value={formData.inclusions}
                                    onChange={(value) => handleInputChange({ target: { name: 'inclusions', value } })}
                                    rows={3}
                                    className="w-full"
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="exclusions">Exclusions</Label>
                            <TextArea
                                id="exclusions"
                                placeholder="Enter what's not included"
                                value={formData.exclusions}
                                onChange={(value) => handleInputChange({ target: { name: 'exclusions', value } })}
                                rows={3}
                                className="w-full"
                            />
                        </div>

                        <div>
                            <Label>Images *</Label>
                            <FileInput
                                onChange={handleFileChange}
                                accept="image/*"
                                multiple
                                className="mb-4"
                            />
                            {existingImages.length > 0 && (
                                <div className="mb-4">
                                    <p className="text-sm text-gray-600 mb-2">Existing Images:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {existingImages.map((image, index) => (
                                            <div key={index} className="relative">
                                                <img
                                                    src={`${import.meta.env.VITE_API_URL}${image}`}
                                                    alt={`Existing ${index + 1}`}
                                                    className="w-20 h-20 object-cover rounded"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {images.length > 0 && (
                                <div>
                                    <p className="text-sm text-gray-600 mb-2">New Images:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {images.map((image, index) => (
                                            <div key={index} className="relative">
                                                <img
                                                    src={URL.createObjectURL(image)}
                                                    alt={`New ${index + 1}`}
                                                    className="w-20 h-20 object-cover rounded"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
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
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                            >
                                {loading ? 'Updating...' : 'Update Bid Tour'}
                            </Button>
                            <Button
                                type="button"
                                onClick={() => navigate('/tours/bid/manage')}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg"
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

export default EditBidTour;