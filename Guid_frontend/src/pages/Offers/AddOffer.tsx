import React, { useState } from 'react';

import PageMeta from '../../components/common/PageMeta';
import { useNavigate } from 'react-router';
import { useTour } from '../../context/TourContext';

const AddOffer: React.FC = () => {
    const navigate = useNavigate();
    const { tours, updateOffer } = useTour();
    const approvedTours = tours.filter(t => t.status === 'approved' && t.tourType !== 'bid');

    const [selectedTour, setSelectedTour] = useState('');
    const [discount, setDiscount] = useState(0);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTour || discount <= 0 || !startDate || !endDate) {
            alert('Please fill in all fields correctly');
            return;
        }

        setLoading(true);
        const result = await updateOffer(selectedTour, {
            discountPercentage: discount,
            startDate,
            endDate,
            isActive: true
        });

        if (result.success) {
            alert('Offer added successfully!');
            navigate('/offers/manage');
        } else {
            alert(result.message);
        }
        setLoading(false);
    };

    return (
        <>
            <PageMeta title="Add Offer | GuideBeeLK" description="Create a new discount offer for your tours" />
            <div className="p-6 max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                    >
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create New Offer</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">Select Tour</label>
                                <select
                                    required
                                    value={selectedTour}
                                    onChange={(e) => setSelectedTour(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                                >
                                    <option value="">Choose an approved tour...</option>
                                    {approvedTours.map(t => (
                                        <option key={t._id} value={t._id}>
                                            {t.title} (${t.price})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">Discount Percentage (%)</label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    max="100"
                                    value={discount}
                                    onChange={(e) => setDiscount(Number(e.target.value))}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">Final Price After Discount</label>
                                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl font-bold text-brand-600 text-lg">
                                    ${selectedTour ? (tours.find(t => t._id === selectedTour)?.price || 0) * (1 - discount / 100) : '0.00'}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">Start Date</label>
                                <input
                                    type="date"
                                    required
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">End Date</label>
                                <input
                                    type="date"
                                    required
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => navigate('/offers/manage')}
                            className="flex-1 px-6 py-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all"
                        >
                            CANCEL
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !selectedTour}
                            className="flex-3 bg-brand-600 hover:bg-brand-700 text-white py-4 px-12 rounded-xl font-black text-lg shadow-md hover:shadow-lg transform transition-all active:scale-95 disabled:opacity-50 disabled:grayscale"
                        >
                            {loading ? 'CREATING OFFER...' : 'CREATE OFFER'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default AddOffer;
