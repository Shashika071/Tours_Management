import React from 'react';
import { useNavigate } from 'react-router';
import PageMeta from '../../components/common/PageMeta';
import { useTour } from '../../context/TourContext';

const ManageOffers: React.FC = () => {
    const navigate = useNavigate();
    const { tours, updateOffer, loading } = useTour();
    const toursWithOffers = tours.filter(t => t.offer && t.offer.discountPercentage > 0);

    const handleToggleOffer = async (tourId: string, currentOffer: any) => {
        const result = await updateOffer(tourId, {
            ...currentOffer,
            isActive: !currentOffer.isActive
        });
        if (!result.success) alert(result.message);
    };

    const handleRemoveOffer = async (tourId: string) => {
        if (!window.confirm('Are you sure you want to remove this offer?')) return;
        const result = await updateOffer(tourId, {
            discountPercentage: 0,
            startDate: null,
            endDate: null,
            isActive: false
        });
        if (!result.success) alert(result.message);
    };

    return (
        <>
            <PageMeta title="Manage Offers | GuideBeeLK" description="View and manage active discounts for your tours" />
            <div className="p-6">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Offers</h1>
                        <p className="text-gray-600 dark:text-gray-400">Track and control your active tour discounts.</p>
                    </div>
                    <button
                        onClick={() => navigate('/offers/add')}
                        className="bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg transform active:scale-95"
                    >
                        Create New Offer
                    </button>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 dark:bg-gray-900/50">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-tighter">Tour Information</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-tighter">Discount</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-tighter">Offer Period</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-tighter">Status</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-tighter text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {loading ? (
                                    <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-medium">Loading offers...</td></tr>
                                ) : toursWithOffers.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-full text-gray-400">
                                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                                <p className="text-gray-500 font-medium">No active offers found.</p>
                                                <button onClick={() => navigate('/offers/add')} className="text-brand-600 font-bold hover:underline">Create your first offer</button>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    toursWithOffers.map((tour) => (
                                        <tr key={tour._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-gray-900 dark:text-white">{tour.title}</div>
                                                <div className="text-xs text-gray-500 mt-1">Original: ${tour.price} | <span className="text-brand-600 font-semibold">Now: ${(tour.price * (1 - tour.offer!.discountPercentage / 100)).toFixed(2)}</span></div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-black">
                                                    {tour.offer!.discountPercentage}% OFF
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                                <div className="flex flex-col gap-1">
                                                    <span className="flex items-center gap-1">
                                                        <span className="w-2 h-2 rounded-full bg-green-400"></span>
                                                        {new Date(tour.offer!.startDate!).toLocaleDateString()}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <span className="w-2 h-2 rounded-full bg-red-400"></span>
                                                        {new Date(tour.offer!.endDate!).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => handleToggleOffer(tour._id, tour.offer)}
                                                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${tour.offer!.isActive ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                                                >
                                                    {tour.offer!.isActive ? 'Active' : 'Paused'}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleRemoveOffer(tour._id)}
                                                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                                    title="Remove Offer"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ManageOffers;
