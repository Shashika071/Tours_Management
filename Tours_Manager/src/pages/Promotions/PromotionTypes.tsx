import React, { useEffect, useState } from 'react';
import PageMeta from '../../components/common/PageMeta';

interface PromotionType {
    _id: string;
    name: string;
    dailyCost: number;
    description: string;
    isActive: boolean;
    slots: number;
    availableSlots?: number;
}

const PromotionTypes: React.FC = () => {
    const [types, setTypes] = useState<PromotionType[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingType, setEditingType] = useState<PromotionType | null>(null);
    const [formData, setFormData] = useState({ name: '', dailyCost: 0, description: '', slots: 0 });

    useEffect(() => {
        fetchTypes();
        const interval = setInterval(fetchTypes, 2000);
        return () => clearInterval(interval);
    }, []);

    const fetchTypes = async () => {
        try {
            const token = localStorage.getItem('adminToken'); // Assuming admin uses 'adminToken'
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/promotions/types`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) setTypes(data);
        } catch (error) {
            console.error('Error fetching types:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('adminToken');
        const url = editingType
            ? `${import.meta.env.VITE_API_URL}/api/admin/promotions/types/${editingType._id}`
            : `${import.meta.env.VITE_API_URL}/api/admin/promotions/types`;
        const method = editingType ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                fetchTypes();
                setIsModalOpen(false);
                setEditingType(null);
                setFormData({ name: '', dailyCost: 0, description: '', slots: 0 });
            }
        } catch (error) {
            console.error('Error saving type:', error);
        }
    };

    const handleEdit = (type: PromotionType) => {
        setEditingType(type);
        setFormData({ name: type.name, dailyCost: type.dailyCost, description: type.description, slots: type.slots });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to deactivate this promotion type?')) return;
        const token = localStorage.getItem('adminToken');
        try {
            await fetch(`${import.meta.env.VITE_API_URL}/api/admin/promotions/types/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchTypes();
        } catch (error) {
            console.error('Error deleting type:', error);
        }
    };

    return (
        <>
            <PageMeta title="Manage Promotion Types | Admin" description="Configure promotion options" />
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Promotion Types</h1>
                    <button
                        onClick={() => { setEditingType(null); setFormData({ name: '', dailyCost: 0, description: '', slots: 0 }); setIsModalOpen(true); }}
                        className="bg-brand-500 hover:bg-brand-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                        Add New Type
                    </button>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-900/50">
                            <tr>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Daily Cost</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Slots (Total/Avail)</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {loading ? (
                                <tr><td colSpan={4} className="px-6 py-4 text-center text-gray-900 dark:text-white">Loading...</td></tr>
                            ) : types.length === 0 ? (
                                <tr><td colSpan={4} className="px-6 py-4 text-center text-gray-900 dark:text-white">No promotion types found.</td></tr>
                            ) : (
                                types.map((type) => (
                                    <tr key={type._id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{type.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">${type.dailyCost}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                            <span className="font-semibold">{type.slots}</span> / <span className={`${(type.availableSlots || 0) > 0 ? 'text-green-600' : 'text-red-600'}`}>{type.availableSlots ?? type.slots}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{type.description}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button onClick={() => handleEdit(type)} className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                                            <button onClick={() => handleDelete(type._id)} className="text-red-600 hover:text-red-900">Delete</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
                            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">{editingType ? 'Edit' : 'Add'} Promotion Type</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Promotion Name</label>
                                    <select
                                        required
                                        value={['Featured Promo', 'Top Tours Promo', 'All Tours Top 20'].includes(formData.name) ? formData.name : (formData.name ? 'custom' : '')}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (val === 'custom') {
                                                setFormData({ ...formData, name: '' });
                                            } else {
                                                setFormData({ ...formData, name: val });
                                            }
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white mb-2"
                                    >
                                        <option value="" disabled>Select a promotion type...</option>
                                        <option value="Featured Promo">Featured Promo</option>
                                        <option value="Top Tours Promo">Top Tours Promo</option>
                                        <option value="All Tours Top 20">All Tours Top 20</option>
                                        <option value="custom">Add Custom Promotion</option>
                                    </select>

                                    {(!['Featured Promo', 'Top Tours Promo', 'All Tours Top 20'].includes(formData.name) || formData.name === '') && (
                                        <input
                                            type="text"
                                            required
                                            placeholder="Enter custom promotion name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                                        />
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Daily Cost ($)</label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.dailyCost}
                                        onChange={(e) => setFormData({ ...formData, dailyCost: parseFloat(e.target.value) })}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                                    <textarea
                                        required
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Total Slots</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={formData.slots}
                                        onChange={(e) => setFormData({ ...formData, slots: parseInt(e.target.value) })}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 dark:text-gray-300">Cancel</button>
                                    <button type="submit" className="flex-1 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600">Save</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default PromotionTypes;
