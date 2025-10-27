import React, { useEffect, useState } from 'react';

import FileInput from '../../components/form/input/FileInput';
import Form from '../../components/form/Form';
import InputField from '../../components/form/input/InputField';
import Select from '../../components/form/Select';
import TextArea from '../../components/form/input/TextArea';
import { useProfile } from '../../context/ProfileContext';

interface GeneralSettingsData {
  dateOfBirth: string;
  country: string;
  city: string;
  nationalId: string;
  registrationNumber: string;
  yearsOfExperience: number;
  languagesSpoken: string;
  areasOfOperation: string;
  specialization: string;
  shortBio: string;
}

const GeneralSettings: React.FC = () => {
  const { guide, refetchProfile } = useProfile();
  const [formData, setFormData] = useState<GeneralSettingsData>({
    dateOfBirth: '',
    country: '',
    city: '',
    nationalId: '',
    registrationNumber: '',
    yearsOfExperience: 0,
    languagesSpoken: '',
    areasOfOperation: '',
    specialization: '',
    shortBio: '',
  });
  const [idFront, setIdFront] = useState<File | null>(null);
  const [idBack, setIdBack] = useState<File | null>(null);
  const [certificate, setCertificate] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (guide) {
      // Load existing profile data
      setFormData({
        dateOfBirth: guide.dateOfBirth ? new Date(guide.dateOfBirth).toISOString().split('T')[0] : '',
        country: guide.country || '',
        city: guide.city || '',
        nationalId: guide.nationalId || '',
        registrationNumber: guide.registrationNumber || '',
        yearsOfExperience: guide.yearsOfExperience || 0,
        languagesSpoken: guide.languagesSpoken || '',
        areasOfOperation: guide.areasOfOperation || '',
        specialization: guide.specialization || '',
        shortBio: guide.shortBio || '',
      });
    }
  }, [guide]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      country: value,
    }));
  };

  const handleTextAreaChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      shortBio: value,
    }));
  };

  const handleFileChange = (setter: React.Dispatch<React.SetStateAction<File | null>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setter(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value.toString());
    });

    if (idFront) formDataToSend.append('idFront', idFront);
    if (idBack) formDataToSend.append('idBack', idBack);
    if (certificate) formDataToSend.append('certificate', certificate);

    try {
      const token = localStorage.getItem('guideToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/guide/auth/profile/update`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (response.ok) {
        const result = await response.json();
        if (result.requiresReApproval) {
          alert('Profile updated successfully! Your changes require admin approval before they take effect. You will be notified once reviewed.');
        } else {
          alert('Profile updated successfully!');
        }
        refetchProfile(); // Refresh profile data
      } else {
        const errorData = await response.json();
        alert(`Failed to update profile: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const countryOptions = [
    { value: 'Sri Lanka', label: 'Sri Lanka' },
    { value: 'India', label: 'India' },
    { value: 'Thailand', label: 'Thailand' },
    // Add more countries as needed
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">General Settings</h1>
      
      {/* Profile Status */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">Profile Status</h3>
        <div className="flex gap-4">
          <span className={`px-3 py-1 rounded-full text-sm ${
            guide?.profileCompleted 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
          }`}>
            {guide?.profileCompleted ? 'Profile Completed' : 'Profile Incomplete'}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm ${
            guide?.profileApproved 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
              : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
          }`}>
            {guide?.profileApproved ? 'Profile Approved' : 'Awaiting Approval'}
          </span>
        </div>
      </div>

      <Form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date of Birth
            </label>
            <InputField
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Country
            </label>
            <Select
              options={countryOptions}
              placeholder="Select Country"
              onChange={handleSelectChange}
              value={formData.country}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              City / District
            </label>
            <InputField
              type="text"
              name="city"
              placeholder="Enter city or district"
              value={formData.city}
              onChange={handleInputChange}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              National ID / Passport Number
            </label>
            <InputField
              type="text"
              name="nationalId"
              placeholder="Enter ID or passport number"
              value={formData.nationalId}
              onChange={handleInputChange}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Registration Number
            </label>
            <InputField
              type="text"
              name="registrationNumber"
              placeholder="Enter registration number (if licensed)"
              value={formData.registrationNumber}
              onChange={handleInputChange}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Years of Experience
            </label>
            <InputField
              type="number"
              name="yearsOfExperience"
              placeholder="Enter years of experience"
              value={formData.yearsOfExperience}
              onChange={handleInputChange}
              className="w-full"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Languages Spoken
            </label>
            <InputField
              type="text"
              name="languagesSpoken"
              placeholder="e.g., English, Sinhala, Tamil"
              value={formData.languagesSpoken}
              onChange={handleInputChange}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Areas or Regions of Operation
            </label>
            <InputField
              type="text"
              name="areasOfOperation"
              placeholder="e.g., Colombo, Kandy, Southern Province"
              value={formData.areasOfOperation}
              onChange={handleInputChange}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Specialization / Expertise
            </label>
            <InputField
              type="text"
              name="specialization"
              placeholder="e.g., Cultural tours, Adventure tours, Eco-tours"
              value={formData.specialization}
              onChange={handleInputChange}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Short Bio / About Me
            </label>
            <TextArea
              placeholder="Tell us about yourself and your experience as a tour guide..."
              value={formData.shortBio}
              onChange={handleTextAreaChange}
              className="w-full"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Upload ID Copy (Front)
              {guide?.idFrontImage && <span className="text-green-600 dark:text-green-400 ml-2">(Uploaded)</span>}
            </div>
            <FileInput onChange={handleFileChange(setIdFront)} />
            {guide?.idFrontImage && (
              <div className="mt-2">
                <a 
                  href={`${import.meta.env.VITE_API_URL}${guide.idFrontImage}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-600 dark:text-blue-400 hover:underline text-sm inline-flex items-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View Current ID Front
                </a>
              </div>
            )}
          </div>

          <div>
            <div className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Upload ID Copy (Back)
              {guide?.idBackImage && <span className="text-green-600 dark:text-green-400 ml-2">(Uploaded)</span>}
            </div>
            <FileInput onChange={handleFileChange(setIdBack)} />
            {guide?.idBackImage && (
              <div className="mt-2">
                <a 
                  href={`${import.meta.env.VITE_API_URL}${guide.idBackImage}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-600 dark:text-blue-400 hover:underline text-sm inline-flex items-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View Current ID Back
                </a>
              </div>
            )}
          </div>

          <div>
            <div className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Certificate or License Upload
              {guide?.certificateImage && <span className="text-green-600 dark:text-green-400 ml-2">(Uploaded)</span>}
            </div>
            <FileInput onChange={handleFileChange(setCertificate)} />
            {guide?.certificateImage && (
              <div className="mt-2">
                <a 
                  href={`${import.meta.env.VITE_API_URL}${guide.certificateImage}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-600 dark:text-blue-400 hover:underline text-sm inline-flex items-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View Current Certificate
                </a>
              </div>
            )}
          </div>
        </div>

        <button type="submit" disabled={loading} className="px-5 py-3.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 w-full md:w-auto">
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </Form>
    </div>
  );
};

export default GeneralSettings;