import React, { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

interface Tour {
  _id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  location: string;
  itinerary?: string;
  inclusions?: string;
  exclusions?: string;
  maxParticipants?: number;
  difficulty: string;
  category: string;
  images: string[];
  guide: string;
  status: 'pending' | 'approved' | 'rejected';
  isActive: boolean;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

interface TourContextType {
  tours: Tour[];
  loading: boolean;
  refetchTours: () => Promise<void>;
  createTour: (tourData: FormData) => Promise<{ success: boolean; message: string; tour?: Tour }>;
  updateTour: (tourId: string, tourData: FormData) => Promise<{ success: boolean; message: string; tour?: Tour }>;
  deleteTour: (tourId: string) => Promise<{ success: boolean; message: string }>;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export const useTour = () => {
  const context = useContext(TourContext);
  if (context === undefined) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
};

interface TourProviderProps {
  children: ReactNode;
}

export const TourProvider: React.FC<TourProviderProps> = ({ children }) => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTours = useCallback(async () => {
    try {
      const token = localStorage.getItem('guideToken');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/guide/tours/my-tours`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTours(data.tours);
      } else {
        setTours([]);
      }
    } catch (error) {
      console.error('Failed to fetch tours:', error);
      setTours([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetchTours = useCallback(async () => {
    setLoading(true);
    await fetchTours();
  }, [fetchTours]);

  const createTour = useCallback(async (tourData: FormData): Promise<{ success: boolean; message: string; tour?: Tour }> => {
    try {
      const token = localStorage.getItem('guideToken');
      console.log('Creating tour with token:', token ? 'present' : 'missing');

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/guide/tours/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: tourData,
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      const result = await response.json();
      console.log('Response result:', result);

      if (response.ok) {
        console.log('Tour creation successful, attempting to refetch...');
        // Try to refresh tours list, but don't fail the creation if this fails
        try {
          await refetchTours();
          console.log('Refetch successful');
        } catch (refetchError) {
          console.warn('Failed to refresh tours after creation:', refetchError);
        }
        return { success: true, message: result.message, tour: result.tour };
      } else {
        console.log('Tour creation failed with message:', result.message);
        return { success: false, message: result.message || 'Failed to create tour' };
      }
    } catch (error) {
      console.error('Error creating tour:', error);
      return { success: false, message: 'Error creating tour' };
    }
  }, [refetchTours]);

  const updateTour = useCallback(async (tourId: string, tourData: FormData): Promise<{ success: boolean; message: string; tour?: Tour }> => {
    try {
      const token = localStorage.getItem('guideToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/guide/tours/${tourId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: tourData,
      });

      const result = await response.json();

      if (response.ok) {
        // Try to refresh tours list, but don't fail the update if this fails
        try {
          await refetchTours();
        } catch (refetchError) {
          console.warn('Failed to refresh tours after update:', refetchError);
        }
        return { success: true, message: result.message, tour: result.tour };
      } else {
        return { success: false, message: result.message || 'Failed to update tour' };
      }
    } catch (error) {
      console.error('Error updating tour:', error);
      return { success: false, message: 'Error updating tour' };
    }
  }, [refetchTours]);

  const deleteTour = useCallback(async (tourId: string): Promise<{ success: boolean; message: string }> => {
    try {
      const token = localStorage.getItem('guideToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/guide/tours/${tourId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setTours(prev => prev.filter(tour => tour._id !== tourId));
        return { success: true, message: 'Tour deleted successfully' };
      } else {
        const result = await response.json();
        return { success: false, message: result.message || 'Failed to delete tour' };
      }
    } catch (error) {
      console.error('Error deleting tour:', error);
      return { success: false, message: 'Error deleting tour' };
    }
  }, []);

  useEffect(() => {
    fetchTours();
  }, [fetchTours]);

  const value = useMemo(() => ({
    tours,
    loading,
    refetchTours,
    createTour,
    updateTour,
    deleteTour,
  }), [tours, loading, refetchTours, createTour, updateTour, deleteTour]);

  return (
    <TourContext.Provider value={value}>
      {children}
    </TourContext.Provider>
  );
};