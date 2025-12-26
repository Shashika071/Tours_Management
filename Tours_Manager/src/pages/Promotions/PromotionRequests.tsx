import React, { useEffect, useState } from 'react';
import PageMeta from '../../components/common/PageMeta';

interface PromotionRequest {
    _id: string;
    guide: { name: string; email: string };
    tour: { title: string };
    promotionType: { name: string };
    duration: number;
    totalCost: number;
    status: 'pending' | 'approved' | 'rejected';
    paymentMethod: string;
    paymentSlip: string | null;
    createdAt: string;
}

const PromotionRequests: React.FC = () => {
    const [requests, setRequests] = useState<PromotionRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState<PromotionRequest | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        fetchRequests();
        const interval = setInterval(fetchRequests, 2000);
        return () => clearInterval(interval);
    }, []);

    const fetchRequests = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/promotions/requests`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) setRequests(data);
        } catch (error) {
            console.error('Error fetching requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async () => {
        if (!selectedRequest || !actionType) return;
        const token = localStorage.getItem('adminToken');

        const body: any = { status: actionType === 'approve' ? 'approved' : 'rejected' };
        if (actionType === 'reject') body.rejectionReason = rejectionReason;
        if (actionType === 'approve') {
            body.startDate = startDate;
            body.endDate = endDate;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/promotions/requests/${selectedRequest._id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });
            if (response.ok) {
                fetchRequests();
                setIsModalOpen(false);
                setSelectedRequest(null);
                setActionType(null);
                setRejectionReason('');
                setStartDate('');
                setEndDate('');
            }
        } catch (error) {
            console.error('Error processing request:', error);
        }
    };

    return (
        <>
            <PageMeta title="Manage Promotion Requests | Admin" description="Review guide promotion requests" />
            <div className="p-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Promotion Requests</h1>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-900/50">
                            <tr>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Guide</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Tour</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {loading ? (
                                <tr><td colSpan={6} className="px-6 py-4 text-center text-gray-900 dark:text-white">Loading...</td></tr>
                            ) : requests.length === 0 ? (
                                <tr><td colSpan={6} className="px-6 py-4 text-center text-gray-900 dark:text-white">No requests found.</td></tr>
                            ) : (
                                requests.map((req) => (
                                    <tr key={req._id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">{req.guide?.name}</div>
                                            <div className="text-xs text-gray-500">{req.guide?.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{req.tour?.title}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{req.promotionType?.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">${req.totalCost}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${req.status === 'approved' ? 'bg-green-100 text-green-800' : req.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => { setSelectedRequest(req); setIsModalOpen(true); }}
                                                className="text-brand-500 hover:text-brand-700 underline"
                                            >
                                                Review
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Review Modal */}
                {isModalOpen && selectedRequest && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Review Promotion Request</h2>

                            <div className="grid grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Guide</label>
                                    <p className="text-gray-900 dark:text-white font-medium">{selectedRequest.guide?.name}</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Tour</label>
                                    <p className="text-gray-900 dark:text-white font-medium">{selectedRequest.tour?.title}</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Promotion Type</label>
                                    <p className="text-gray-900 dark:text-white font-medium">{selectedRequest.promotionType?.name} ({selectedRequest.duration} Days)</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Total Cost</label>
                                    <p className="text-brand-500 font-bold text-lg">${selectedRequest.totalCost}</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Payment Method</label>
                                    <p className="text-gray-900 dark:text-white font-medium uppercase">{selectedRequest.paymentMethod.replace('_', ' ')}</p>
                                </div>
                            </div>

                            {selectedRequest.paymentSlip && (
                                <div className="mb-6">
                                    <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Payment Slip</label>
                                    <img
                                        src={`${import.meta.env.VITE_API_URL}/${selectedRequest.paymentSlip}`}
                                        alt="Payment Slip"
                                        className="w-full max-h-64 object-contain rounded-lg border border-gray-200 dark:border-gray-700"
                                    />
                                    <a
                                        href={`${import.meta.env.VITE_API_URL}/${selectedRequest.paymentSlip}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-brand-500 hover:underline mt-2 block"
                                    >
                                        View Full Image
                                    </a>
                                </div>
                            )}

                            {selectedRequest.status === 'pending' && (
                                <div className="space-y-6 border-t border-gray-100 dark:border-gray-700 pt-6">
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => setActionType('approve')}
                                            className={`flex-1 py-2 rounded-lg font-medium border-2 transition-all ${actionType === 'approve' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 dark:border-gray-700 text-gray-500'}`}
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => setActionType('reject')}
                                            className={`flex-1 py-2 rounded-lg font-medium border-2 transition-all ${actionType === 'reject' ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 dark:border-gray-700 text-gray-500'}`}
                                        >
                                            Reject
                                        </button>
                                    </div>

                                    {actionType === 'approve' && (
                                        <div className="grid grid-cols-2 gap-4 animate-in fade-in duration-300">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
                                                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
                                                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white" />
                                            </div>
                                        </div>
                                    )}

                                    {actionType === 'reject' && (
                                        <div className="animate-in fade-in duration-300">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rejection Reason</label>
                                            <textarea
                                                value={rejectionReason}
                                                onChange={(e) => setRejectionReason(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white"
                                                placeholder="Explain why the request was rejected..."
                                            />
                                        </div>
                                    )}

                                    {actionType && (
                                        <button
                                            onClick={handleAction}
                                            className={`w-full py-3 rounded-lg font-bold text-white transition-all ${actionType === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                                        >
                                            Confirm {actionType.charAt(0).toUpperCase() + actionType.slice(1)}
                                        </button>
                                    )}
                                </div>
                            )}

                            <div className="flex gap-4 pt-6 border-t border-gray-100 dark:border-gray-700 mt-6">
                                <button type="button" onClick={() => { setIsModalOpen(false); setActionType(null); }} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 dark:text-gray-300 font-medium">Close</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default PromotionRequests;
