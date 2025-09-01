import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserProfile {
  name: string;
  phoneNumber?: string;
  position?: string;
  email: string;
  isProfileCompleted?: boolean;
  hasBusinessInfo?: boolean;
}

interface BusinessInfo {
  name: string;
  businessNumber?: string;
  address?: string;
  category?: string;
  description?: string;
}

interface UserState {
  // 사용자 프로필
  userProfile: UserProfile | null;
  // 사업 정보
  businessInfo: BusinessInfo | null;
  // 로딩 상태
  isLoading: boolean;
  // 에러 상태
  error: string | null;
  
  // Actions
  setUserProfile: (profile: UserProfile | null) => void;
  setBusinessInfo: (business: BusinessInfo | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // 데이터 로드
  fetchUserData: () => Promise<void>;
  
  // 초기화
  clearUser: () => void;
}

const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      userProfile: null,
      businessInfo: null,
      isLoading: false,
      error: null,
      
      setUserProfile: (profile) => set({ userProfile: profile }),
      setBusinessInfo: (business) => set({ businessInfo: business }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      
      fetchUserData: async () => {
        set({ isLoading: true, error: null });
        
        try {
          // 프로필 정보 가져오기
          const profileResponse = await fetch('/api/user/profile', {
            credentials: 'include'
          });
          
          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            if (profileData.data) {
              set({ 
                userProfile: {
                  name: profileData.data.name || '사용자',
                  phoneNumber: profileData.data.phoneNumber,
                  position: profileData.data.position,
                  email: profileData.data.email || '',
                  isProfileCompleted: profileData.data.isProfileCompleted,
                  hasBusinessInfo: profileData.data.hasBusinessInfo
                }
              });
            }
          }
          
          // 사업정보 가져오기
          const businessResponse = await fetch('/api/business/get', {
            credentials: 'include'
          });
          
          if (businessResponse.ok) {
            const businessData = await businessResponse.json();
            
            if (businessData.success && businessData.data && businessData.data.name) {
              set({
                businessInfo: {
                  name: businessData.data.name,
                  businessNumber: businessData.data.businessNumber,
                  address: businessData.data.address,
                  category: businessData.data.category,
                  description: businessData.data.description
                }
              });
            } else {
              set({ businessInfo: null });
            }
          }
        } catch (error) {
          console.error('사용자 정보 로드 오류:', error);
          set({ error: '사용자 정보를 불러오는데 실패했습니다.' });
        } finally {
          set({ isLoading: false });
        }
      },
      
      clearUser: () => {
        set({
          userProfile: null,
          businessInfo: null,
          isLoading: false,
          error: null
        });
      }
    }),
    {
      name: 'user-storage', // localStorage key
      partialize: (state) => ({ 
        userProfile: state.userProfile,
        businessInfo: state.businessInfo 
      }) // 저장할 데이터만 선택
    }
  )
);

export default useUserStore;