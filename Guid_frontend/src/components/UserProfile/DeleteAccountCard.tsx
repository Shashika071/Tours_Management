import { useState } from 'react';
import { useProfile } from '../../context/ProfileContext';

export default function DeleteAccountCard() {
    const { guide, refetchProfile } = useProfile();
    const [showModal, setShowModal] = useState(false);
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRequestDeletion = async () => {
        if (!reason.trim()) {
            alert('Please provide a reason for deletion');
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('guideToken');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/guide/auth/profile/delete-request`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ reason }),
            });

            if (response.ok) {
                alert('Deletion request sent to manager');
                setShowModal(false);
                refetchProfile();
            } else {
                const data = await response.json();
                alert(data.message || 'Failed to send request');
            }
        } catch (error) {
            console.error('Error requesting deletion:', error);
            alert('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelDeletion = async () => {
        if (!window.confirm('Are you sure you want to cancel your deletion request?')) return;

        setLoading(true);
        try {
            const token = localStorage.getItem('guideToken');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/guide/auth/profile/cancel-delete`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                alert('Deletion request cancelled');
                refetchProfile();
            } else {
                const data = await response.json();
                alert(data.message || 'Failed to cancel request');
            }
        } catch (error) {
            console.error('Error cancelling deletion:', error);
            alert('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    if (!guide) return null;

    return (
        <div className="p-5 border border-red-100 rounded-2xl bg-red-50/30 dark:border-red-900/30 dark:bg-red-900/5 lg:p-6 mt-6">
            <h4 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-4">
                Danger Zone
            </h4>

            {guide.deletionRequested ? (
                <div className="bg-white p-4 rounded-xl border border-red-200 dark:bg-gray-900 dark:border-red-900/50">
                    <p className="text-sm text-gray-800 dark:text-white/90 mb-2 font-medium">
                        Account Deletion Requested
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                        You requested to delete your account on {guide.deletionRequestDate ? new Date(guide.deletionRequestDate).toLocaleDateString() : 'N/A'}.
                        A manager is currently reviewing your request.
                    </p>
                    <button
                        onClick={handleCancelDeletion}
                        disabled={loading}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                    >
                        {loading ? 'Processing...' : 'Cancel Request'}
                    </button>
                </div>
            ) : (
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        Once you request account deletion, a manager will review it before final removal.
                        This action cannot be undone once confirmed by the manager.
                    </p>
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium"
                    >
                        Delete Account
                    </button>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md shadow-xl">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Request Account Deletion</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                            Please tell us why you want to leave. This information helps us improve.
                        </p>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full p-3 border border-gray-200 rounded-xl dark:border-gray-800 dark:bg-white/[0.03] mb-4 text-sm"
                            placeholder="Reason for leaving..."
                            rows={4}
                        />
                        <div className="flex justify-end gap-3 font-medium">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRequestDeletion}
                                disabled={loading || !reason.trim()}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 text-sm"
                            >
                                {loading ? 'Sending...' : 'Confirm Request'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
