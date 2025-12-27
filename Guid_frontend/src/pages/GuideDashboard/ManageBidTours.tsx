import React from 'react';
import { useTour } from '../../context/TourContext';
import PageMeta from '../../components/common/PageMeta';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import ComponentCard from '../../components/common/ComponentCard';
import Badge from '../../components/ui/badge/Badge';

const ManageBidTours: React.FC = () => {
    const { tours, loading } = useTour();

    const bidTours = tours.filter(tour => tour.tourType === 'bid');

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return <Badge color="success">Approved</Badge>;
            case 'pending':
                return <Badge color="warning">Pending Approval</Badge>;
            case 'rejected':
                return <Badge color="error">Rejected</Badge>;
            default:
                return <Badge color="light">{status}</Badge>;
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
                                                <div className="text-sm text-gray-900 dark:text-gray-100">${tour.bidDetails?.startingPrice}</div>
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
