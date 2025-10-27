import React, { useEffect, useState } from 'react';

import Form from '../../components/form/Form';
import InputField from '../../components/form/input/InputField';
import Select from '../../components/form/Select';
import { useProfile } from '../../context/ProfileContext';

interface PaymentSettingsData {
  preferredPaymentMethod: string;
  bankAccountNumber: string;
  taxId: string;
}

const PaymentSettings: React.FC = () => {
  const { guide, refetchProfile } = useProfile();
  const [formData, setFormData] = useState<PaymentSettingsData>({
    preferredPaymentMethod: '',
    bankAccountNumber: '',
    taxId: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (guide) {
      // Load existing payment data
      setFormData({
        preferredPaymentMethod: guide.preferredPaymentMethod || '',
        bankAccountNumber: guide.bankAccountNumber || '',
        taxId: guide.taxId || '',
      });
    }
  }, [guide]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      preferredPaymentMethod: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('guideToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/guide/auth/payment/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Payment settings updated successfully!');
        refetchProfile(); // Refresh profile data
      } else {
        alert('Failed to update payment settings');
      }
    } catch (error) {
      console.error('Error updating payment settings:', error);
      alert('Error updating payment settings');
    } finally {
      setLoading(false);
    }
  };

  const paymentMethodOptions = [
    { value: 'Bank Transfer', label: 'Bank Transfer' },
    { value: 'PayPal', label: 'PayPal' },
    { value: 'Stripe', label: 'Stripe' },
    { value: 'Other', label: 'Other' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Payment Settings</h1>
      
      {/* Profile Status */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-medium mb-2">Profile Status</h3>
        <div className="flex gap-4">
          <span className={`px-3 py-1 rounded-full text-sm ${guide?.profileCompleted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {guide?.profileCompleted ? 'Profile Completed' : 'Profile Incomplete'}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm ${guide?.profileApproved ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
            {guide?.profileApproved ? 'Profile Approved' : 'Awaiting Approval'}
          </span>
        </div>
      </div>

      <Form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            options={paymentMethodOptions}
            placeholder="Select Preferred Payment Method"
            onChange={handleSelectChange}
            value={formData.preferredPaymentMethod}
            className="w-full"
          />

          <InputField
            type="text"
            name="bankAccountNumber"
            placeholder="Bank Account or Wallet Number"
            value={formData.bankAccountNumber}
            onChange={handleInputChange}
            className="w-full"
          />

          <InputField
            type="text"
            name="taxId"
            placeholder="Tax ID / VAT Number (if applicable)"
            value={formData.taxId}
            onChange={handleInputChange}
            className="w-full"
          />
        </div>

        <button type="submit" disabled={loading} className="px-5 py-3.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 w-full md:w-auto">
          {loading ? 'Updating...' : 'Update Payment Settings'}
        </button>
      </Form>
    </div>
  );
};

export default PaymentSettings;