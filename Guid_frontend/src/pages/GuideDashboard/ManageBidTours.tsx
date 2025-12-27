import Badge from '../../components/ui/badge/Badge';
import ComponentCard from '../../components/common/ComponentCard';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import PageMeta from '../../components/common/PageMeta';
import React from 'react';
import { useNavigate } from 'react-router';
import { useTour } from '../../context/TourContext';

const ManageBidTours: React.FC = () => {
    const { tours, loading, deleteTour } = useTour();
    const navigate = useNavigate();

    const bidTours = tours.filter(tour => tour.tourType === 'bid');

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return <Badge color="success">Approved</Badge>;
            case 'pending':
                return <Badge color="warning">Pending Approval</Badge>;
            case 'rejected':
                return <Badge color="error">Rejected</Badge>;
            case 'pending_deletion':
                return <Badge color="warning">Pending Deletion</Badge>;
            default:
                return <Badge color="light">{status}</Badge>;
        }
    };

    const handleEdit = (tourId: string) => {
        navigate(`/tours/bid/edit/${tourId}`);
    };

    const handleDelete = async (tourId: string) => {
        if (window.confirm('Are you sure you want to delete this bid tour?')) {
            const result = await deleteTour(tourId);
            if (!result.success) {
                alert(`Failed to delete tour: ${result.message}`);
            }
        }
    };

    const handleRequestEdit = async (tourId: string) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/guide/tours/${tourId}/request-edit`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('guideToken')}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                alert('Edit permission request sent to manager successfully!');
            } else {
                const error = await response.json();
                alert(`Failed to send edit request: ${error.message}`);
            }
        } catch (error) {
            console.error('Error requesting edit permission:', error);
            alert('Failed to send edit request. Please try again.');
        }
    };

    const handleRequestDelete = async (tourId: string) => {
        if (window.confirm('Are you sure you want to request deletion of this approved tour? A manager will need to approve this request.')) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/guide/tours/${tourId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('guideToken')}`,
                    },
                });

                if (response.ok) {
                    const result = await response.json();
                    alert(result.message || 'Delete permission request sent to manager successfully!');
                } else {
                    const error = await response.json();
                    alert(`Failed to send delete request: ${error.message}`);
                }
            } catch (error) {
                console.error('Error requesting delete permission:', error);
                alert('Failed to send delete request. Please try again.');
            }
        }
    };

    return (
        <>
            <PageMeta
                title="Manage Bid Tours | Guide Dashboard"
                description="View and manage your bid-based tours"
            />
            <PageBreadcrumb pageTitle="Manage Bid Tours" />

            <div className="grid grid-cols-1 gap-6">
                <ComponentCard title="Your Bid Tours">
                    {loading ? (
                        <div className="text-center py-6">Loading tours...</div>
                    ) : bidTours.length === 0 ? (
                        <div className="text-center py-6 text-gray-500">You haven't added any bid tours yet.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-800">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tour</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Starting Price</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bid End Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Highest Bid</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                                    {bidTours.map((tour) => (
                                        <tr key={tour._id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <img
                                                            className="h-10 w-10 rounded-full object-cover"
                                                            src={`${import.meta.env.VITE_API_URL}${tour.images[0]}`}
                                                            alt=""
                                                        />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{tour.title}</div>
                                                        <div className="text-sm text-gray-500">{tour.location}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className={`text-sm font-medium ${tour.status === 'pending' ? 'text-orange-600 dark:text-orange-400 font-bold' : 'text-gray-900 dark:text-gray-100'}`}>
                                                    ${tour.bidDetails?.startingPrice}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {tour.bidDetails?.bidEndDate ? new Date(tour.bidDetails.bidEndDate).toLocaleDateString() : 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(tour.status)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-gray-100">
                                                ${tour.bidDetails?.currentHighestBid || tour.bidDetails?.startingPrice}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    {tour.status === 'pending' ? (
                                                        <>
                                                            <button
                                                                onClick={() => handleEdit(tour._id)}
                                                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(tour._id)}
                                                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                            >
                                                                Delete
                                                            </button>
                                                        </>
                                                    ) : tour.status === 'approved' ? (
                                                        <>
                                                            <button
                                                                onClick={() => handleEdit(tour._id)}
                                                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() => handleRequestDelete(tour._id)}
                                                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                            >
                                                                Request Delete
                                                            </button>
                                                        </>
                                                    ) : tour.status === 'pending_deletion' ? (
                                                        <span className="text-orange-600 dark:text-orange-400 font-medium">Pending Deletion Approval</span>
                                                    ) : (
                                                        <span className="text-gray-500">No actions available</span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </ComponentCard>
            </div>
        </>
    );
};

export default ManageBidTours;
