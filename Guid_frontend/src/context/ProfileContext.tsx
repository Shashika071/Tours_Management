import React, { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

interface Guide {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  profileImage?: string;
  status: string;
}

interface ProfileContextType {
  guide: Guide | null;
  loading: boolean;
  refetchProfile: () => Promise<void>;
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

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const value = useMemo(() => ({
    guide,
    loading,
    refetchProfile,
  }), [guide, loading, refetchProfile]);

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};