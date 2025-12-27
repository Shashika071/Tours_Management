import React, { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

interface Guide {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  profileImage?: string;
  dateOfBirth?: string;
  country?: string;
  city?: string;
  nationalId?: string;
  idFrontImage?: string;
  idBackImage?: string;
  registrationNumber?: string;
  certificateImage?: string;
  yearsOfExperience?: number;
  languagesSpoken?: string;
  areasOfOperation?: string;
  specialization?: string;
  shortBio?: string;
  preferredPaymentMethod?: string;
  bankAccountNumber?: string;
  taxId?: string;
  profileCompleted: boolean;
  profileApproved: boolean;
  profileRejectionReason?: string;
  status: string;
  deletionRequested?: boolean;
  deletionReason?: string;
  deletionRequestDate?: string;
}

interface ProfileContextType {
  guide: Guide | null;
  loading: boolean;
  refetchProfile: () => Promise<void>;
  pausePolling: () => void;
  resumePolling: () => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

interface ProfileProviderProps {
  children: ReactNode;
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
  const [guide, setGuide] = useState<Guide | null>(null);
  const [loading, setLoading] = useState(true);
  const [pausePollingState, setPausePollingState] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem('guideToken');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/guide/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setGuide(data.guide);
      } else {
        setGuide(null);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      setGuide(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetchProfile = useCallback(async () => {
    setLoading(true);
    await fetchProfile();
  }, [fetchProfile]);

  const pausePolling = useCallback(() => {
    setPausePollingState(true);
  }, []);

  const resumePolling = useCallback(() => {
    setPausePollingState(false);
  }, []);

  useEffect(() => {
    fetchProfile();

    // Set up polling for real-time updates (every 60 seconds), but only if not paused
    const pollInterval = setInterval(() => {
      if (!pausePollingState) {
        fetchProfile();
      }
    }, 60000);

    return () => clearInterval(pollInterval);
  }, [fetchProfile, pausePollingState]);

  const value = useMemo(() => ({
    guide,
    loading,
    refetchProfile,
    pausePolling,
    resumePolling,
  }), [guide, loading, refetchProfile, pausePolling, resumePolling]);

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};