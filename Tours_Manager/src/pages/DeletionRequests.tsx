import React, { useEffect, useState } from 'react';

interface Guide {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    deletionReason: string;
    deletionRequestDate: string;
}

const DeletionRequests: React.FC = () => {
    const [requests, setRequests] = useState<Guide[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [showRejectModal, setShowRejectModal] = useState<string | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/guides/deletion-requests`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error('Failed to fetch deletion requests');

            const data = await response.json();
            setRequests(data.guides || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmDeletion = async (guideId: string) => {
        if (!window.confirm('CRITICAL: Are you sure you want to permanently delete this account? This will send a confirmation email and remove all guide data.')) return;

        setActionLoading(guideId);
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/guides/${guideId}/confirm-deletion`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                setRequests(requests.filter(r => r._id !== guideId));
                alert('Account deleted successfully');
            } else {
                const data = await response.json();
                alert(data.message || 'Failed to delete account');
            }
        } catch (err) {
            console.error(err);
            alert('An error occurred');
        } finally {
            setActionLoading(null);
        }
    };

    const handleRejectRequest = async () => {
        if (!rejectionReason.trim()) return;

        setActionLoading(showRejectModal);
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/guides/${showRejectModal}/reject-deletion`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ reason: rejectionReason }),
            });

            if (response.ok) {
                setRequests(requests.filter(r => r._id !== showRejectModal));
                setShowRejectModal(null);
                setRejectionReason('');
                alert('Deletion request rejected and guide informed');
            } else {
                const data = await response.json();
                alert(data.message || 'Failed to reject request');
            }
        } catch (err) {
            console.error(err);
            alert('An error occurred');
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) return <div className="p-6 text-gray-500">Loading requests...</div>;
    if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Account Deletion Requests</h1>
                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    {requests.length} Pending
                </span>
            </div>

            {requests.length === 0 ? (
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-10 border border-gray-100 dark:border-gray-800 text-center">
                    <p className="text-gray-500 dark:text-gray-400">No pending account deletion requests.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {requests.map((guide) => (
                        <div key={guide._id} className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 transition hover:shadow-md">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-lg font-bold text-gray-800 dark:text-white">{guide.name}</h3>
                                    <span className="text-xs text-gray-400">• Requested on {new Date(guide.deletionRequestDate).toLocaleDateString()}</span>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{guide.email} • {guide.phone || 'No phone'}</p>

                                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                                    <p className="text-xs font-bold text-gray-400 uppercase mb-2">Reason for leaving</p>
                                    <p className="text-sm text-gray-700 dark:text-gray-300 italic">"{guide.deletionReason}"</p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowRejectModal(guide._id)}
                                    disabled={!!actionLoading}
                                    className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition disabled:opacity-50"
                                >
                                    Reject Request
                                </button>
                                <button
                                    onClick={() => handleConfirmDeletion(guide._id)}
                                    disabled={!!actionLoading}
                                    className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition disabled:opacity-50 flex items-center gap-2"
                                >
                                    {actionLoading === guide._id ? (
                                        'Deleting...'
                                    ) : (
                                        <>
                                            Confirm Deletion
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showRejectModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md shadow-xl border border-gray-100 dark:border-gray-800">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Reject Deletion Request</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                            Please provide a reason why this deletion request is being rejected. This will be emailed to the guide.
                        </p>
                        <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-transparent mb-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="E.g. You have pending bookings that must be completed first..."
                            rows={4}
                        />
                        <div className="flex justify-end gap-3 font-medium">
                            <button
                                onClick={() => { setShowRejectModal(null); setRejectionReason(''); }}
                                className="px-4 py-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRejectRequest}
                                disabled={!!actionLoading || !rejectionReason.trim()}
                                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 text-sm"
                            >
                                {actionLoading === showRejectModal ? 'Processing...' : 'Send Message'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeletionRequests;
