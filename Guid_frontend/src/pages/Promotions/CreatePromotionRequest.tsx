import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import PageMeta from '../../components/common/PageMeta';
import { useTour } from '../../context/TourContext';

interface PromotionType {
    _id: string;
    name: string;
    dailyCost: number;
    description: string;
}

const CreatePromotionRequest: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { tours } = useTour();

    // Get tourId from query params if available
    const queryParams = new URLSearchParams(location.search);
    const initialTourId = queryParams.get('tourId') || '';

    const [promoTypes, setPromoTypes] = useState<PromotionType[]>([]);
    const [selectedTour, setSelectedTour] = useState(initialTourId);
    const [selectedType, setSelectedType] = useState('');
    const [duration, setDuration] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank_transfer'>('card');
    const [paymentSlip, setPaymentSlip] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    // Filter approved tours for promotion
    const approvedTours = tours.filter(t => t.status === 'approved');

    useEffect(() => {
        fetchPromoTypes();
    }, []);

    const fetchPromoTypes = async () => {
        try {
            const token = localStorage.getItem('guideToken');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/guide/promotions/types`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setPromoTypes(data);
            }
        } catch (error) {
            console.error('Error fetching promotion types:', error);
        }
    };

    const selectedTypeDetails = promoTypes.find(t => t._id === selectedType);
    const totalCost = selectedTypeDetails ? selectedTypeDetails.dailyCost * duration : 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTour || !selectedType) {
            alert('Please select both a tour and a promotion type');
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem('guideToken');
            const formData = new FormData();
            formData.append('tourId', selectedTour);
            formData.append('promotionTypeId', selectedType);
            formData.append('duration', duration.toString());
            formData.append('paymentMethod', paymentMethod);
            if (paymentSlip) formData.append('paymentSlip', paymentSlip);

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/guide/promotions/request`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            });

            if (response.ok) {
                alert('Promotion request submitted successfully!');
                navigate('/tours/promote');
            } else {
                const error = await response.json();
                alert(error.message || 'Failed to submit request');
            }
        } catch (error) {
            console.error('Error submitting request:', error);
            alert('Error submitting request');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <PageMeta title="Promote New Tour | GuideBeeLK" description="Submit a promotion request" />
            <div className="p-6 max-w-5xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                    >
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Promote Your Tour</h1>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Tour Selection */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wider">Step 1: Select Tour</label>
                            <select
                                required
                                value={selectedTour}
                                onChange={(e) => setSelectedTour(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                            >
                                <option value="">Select an approved tour to promote...</option>
                                {approvedTours.map(t => <option key={t._id} value={t._id}>{t.title}</option>)}
                            </select>
                            {approvedTours.length === 0 && (
                                <p className="mt-2 text-sm text-amber-600">You don't have any approved tours yet. Only approved tours can be promoted.</p>
                            )}
                        </div>

                        {/* Promotion Type Selection */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wider">Step 2: Choose Promotion Plan</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {promoTypes.map(type => (
                                    <div
                                        key={type._id}
                                        onClick={() => setSelectedType(type._id)}
                                        className={`cursor-pointer p-5 border-2 rounded-xl transition-all relative overflow-hidden ${selectedType === type._id ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-900/10' : 'border-gray-100 dark:border-gray-700 hover:border-brand-200 dark:hover:border-brand-800'}`}
                                    >
                                        {selectedType === type._id && (
                                            <div className="absolute top-2 right-2 text-brand-500">
                                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        )}
                                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">{type.name}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">{type.description}</p>
                                        <div className="mt-4 flex items-baseline gap-1">
                                            <span className="text-2xl font-black text-brand-600">${type.dailyCost}</span>
                                            <span className="text-xs text-gray-500 uppercase font-bold">/ day</span>
                                        </div>
                                    </div>
                                ))}
                                {promoTypes.length === 0 && (
                                    <p className="text-center py-4 text-gray-500">Loading promotion plans...</p>
                                )}
                            </div>
                        </div>

                        {/* Duration */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wider">Step 3: Promotion Duration</label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="range"
                                    min="1"
                                    max="30"
                                    value={duration}
                                    onChange={(e) => setDuration(parseInt(e.target.value))}
                                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-500"
                                />
                                <div className="w-24 px-4 py-2 border border-gray-200 rounded-lg text-center font-bold text-brand-600 bg-brand-50">
                                    {duration} Days
                                </div>
                            </div>
                            <p className="mt-3 text-sm text-gray-500 italic">Select how many days you want your tour to be promoted.</p>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wider">Step 4: Payment Details</label>
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <label className={`flex flex-col items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-brand-500 bg-brand-50' : 'border-gray-100 hover:border-brand-100'}`}>
                                    <input type="radio" name="payment" value="card" className="hidden" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                                    <svg className={`w-8 h-8 ${paymentMethod === 'card' ? 'text-brand-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                    </svg>
                                    <span className={`font-medium ${paymentMethod === 'card' ? 'text-brand-700' : 'text-gray-500'}`}>Credit/Debit Card</span>
                                </label>
                                <label className={`flex flex-col items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'bank_transfer' ? 'border-brand-500 bg-brand-50' : 'border-gray-100 hover:border-brand-100'}`}>
                                    <input type="radio" name="payment" value="bank_transfer" className="hidden" checked={paymentMethod === 'bank_transfer'} onChange={() => setPaymentMethod('bank_transfer')} />
                                    <svg className={`w-8 h-8 ${paymentMethod === 'bank_transfer' ? 'text-brand-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                    </svg>
                                    <span className={`font-medium ${paymentMethod === 'bank_transfer' ? 'text-brand-700' : 'text-gray-500'}`}>Bank Transfer</span>
                                </label>
                            </div>

                            {paymentMethod === 'bank_transfer' && (
                                <div className="space-y-4 animate-in slide-in-from-top duration-300">
                                    <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                                        <h4 className="font-bold text-amber-800 text-sm mb-2">Our Bank Details:</h4>
                                        <p className="text-sm text-amber-700">Bank: HNB Bank | Branch: Colombo 07</p>
                                        <p className="text-sm text-amber-700">Acc Name: GuideBeeLK Pvt Ltd</p>
                                        <p className="text-sm text-amber-700 font-bold">Acc No: 1234 5678 9012 3456</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Upload Payment Slip (Screenshot/Photo)</label>
                                        <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-4 text-center hover:border-brand-400 transition-colors">
                                            <input
                                                type="file"
                                                required
                                                accept="image/*"
                                                onChange={(e) => setPaymentSlip(e.target.files?.[0] || null)}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            />
                                            <div className="space-y-1">
                                                <svg className="mx-auto h-8 w-8 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                <p className="text-sm text-gray-500">
                                                    {paymentSlip ? <span className="text-brand-600 font-bold">{paymentSlip.name}</span> : 'Click to upload or drag and drop'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {paymentMethod === 'card' && (
                                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center text-gray-500 text-sm">
                                    You will be redirected to our secure payment gateway upon submission.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Summary Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden sticky top-6">
                            <div className="bg-brand-600 p-6 text-white text-center">
                                <h2 className="text-xl font-bold">Order Summary</h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Plan</span>
                                    <span className="font-bold text-gray-900 dark:text-white uppercase tracking-wider">{selectedTypeDetails?.name || '---'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Daily Rate</span>
                                    <span className="font-bold text-gray-900 dark:text-white">${selectedTypeDetails?.dailyCost || 0}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Duration</span>
                                    <span className="font-bold text-gray-900 dark:text-white">{duration} Days</span>
                                </div>
                                <div className="h-px bg-gray-100 dark:bg-gray-700 my-4"></div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-900 dark:text-white font-bold">Grand Total</span>
                                    <span className="text-3xl font-black text-brand-600">${totalCost}</span>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || !selectedTour || !selectedType}
                                    className="w-full mt-6 bg-brand-600 hover:bg-brand-700 text-white py-4 rounded-xl font-black text-lg shadow-md hover:shadow-lg transform transition-all active:scale-95 disabled:opacity-50 disabled:grayscale"
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            PROCESSING...
                                        </div>
                                    ) : 'CONFIRM & APPLY'}
                                </button>
                                <p className="text-[10px] text-gray-400 text-center uppercase mt-4">Safe and secure payment powered by GuideBeeLK</p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default CreatePromotionRequest;
