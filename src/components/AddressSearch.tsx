'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui';

interface AddressData {
  zipCode: string;
  address: string;
  addressDetail?: string;
  sigunguCode: string;
  latitude: number;
  longitude: number;
}

interface AddressSearchProps {
  onAddressSelect: (data: AddressData) => void;
  disabled?: boolean;
}

// 시군구 코드 매핑 (주요 지역만 예시)
const SIGUNGU_CODE_MAP: { [key: string]: string } = {
  '서울특별시 강남구': '11680',
  '서울특별시 강동구': '11740',
  '서울특별시 강북구': '11305',
  '서울특별시 강서구': '11500',
  '서울특별시 관악구': '11620',
  '서울특별시 광진구': '11215',
  '서울특별시 구로구': '11530',
  '서울특별시 금천구': '11545',
  '서울특별시 노원구': '11350',
  '서울특별시 도봉구': '11320',
  '서울특별시 동대문구': '11230',
  '서울특별시 동작구': '11590',
  '서울특별시 마포구': '11440',
  '서울특별시 서대문구': '11410',
  '서울특별시 서초구': '11650',
  '서울특별시 성동구': '11200',
  '서울특별시 성북구': '11290',
  '서울특별시 송파구': '11710',
  '서울특별시 양천구': '11470',
  '서울특별시 영등포구': '11560',
  '서울특별시 용산구': '11170',
  '서울특별시 은평구': '11380',
  '서울특별시 종로구': '11110',
  '서울특별시 중구': '11140',
  '서울특별시 중랑구': '11260',
  // 부산광역시
  '부산광역시 중구': '26110',
  '부산광역시 서구': '26140',
  '부산광역시 동구': '26170',
  '부산광역시 영도구': '26200',
  '부산광역시 부산진구': '26230',
  '부산광역시 동래구': '26260',
  '부산광역시 남구': '26290',
  '부산광역시 북구': '26320',
  '부산광역시 해운대구': '26350',
  // 대구광역시
  '대구광역시 중구': '27110',
  '대구광역시 동구': '27140',
  '대구광역시 서구': '27170',
  '대구광역시 남구': '27200',
  '대구광역시 북구': '27230',
  // 경기도 주요 지역
  '경기도 수원시 장안구': '41111',
  '경기도 수원시 영통구': '41115',
  '경기도 성남시 분당구': '41135',
  '경기도 안양시 만안구': '41171',
  '경기도 안양시 동안구': '41173',
  '경기도 고양시 덕양구': '41281',
  '경기도 고양시 일산동구': '41285',
  '경기도 고양시 일산서구': '41287',
};

// Kakao Maps API를 통한 좌표 변환 함수
const getCoordinates = async (address: string): Promise<{ latitude: number; longitude: number } | null> => {
  try {
    const kakaoApiKey = process.env.NEXT_PUBLIC_KAKAO_API_KEY;
    
    if (!kakaoApiKey) {
      throw new Error('Kakao API Key가 설정되지 않았습니다.');
    }

    const response = await fetch(
      `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(address)}`,
      {
        headers: {
          'Authorization': `KakaoAK ${kakaoApiKey}`
        }
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`좌표 변환 실패: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.documents && data.documents.length > 0) {
      const { x, y } = data.documents[0];
      return {
        longitude: parseFloat(x),
        latitude: parseFloat(y)
      };
    }
    
    return null;
  } catch (error) {
    return null;
  }
};

declare global {
  interface Window {
    daum: any;
  }
}

export default function AddressSearch({ onAddressSelect, disabled = false }: AddressSearchProps) {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    // Daum Postcode API 스크립트 로드
    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.onload = () => setIsScriptLoaded(true);
    document.head.appendChild(script);

    return () => {
      // 컴포넌트 언마운트 시 스크립트 제거
      const existingScript = document.querySelector('script[src*="postcode.v2.js"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  const handleComplete = async (data: any) => {
    const { 
      zonecode, 
      roadAddress, 
      jibunAddress, 
      sido, 
      sigungu,
      sigunguCode: daumSigunguCode,
      roadnameCode,
      bcode 
    } = data;
    
    // 시군구 코드 결정 (Daum API 제공값 우선 사용)
    let finalSigunguCode = '';
    
    if (daumSigunguCode) {
      // Daum API에서 직접 제공하는 시군구 코드 사용
      finalSigunguCode = daumSigunguCode;
    } else if (bcode) {
      // 법정동 코드에서 시군구 코드 추출 (앞 5자리)
      finalSigunguCode = bcode.substring(0, 5);
    } else {
      // 매핑 테이블에서 찾기
      const sigunguKey = `${sido} ${sigungu}`;
      finalSigunguCode = SIGUNGU_CODE_MAP[sigunguKey] || '';
    }
    
    // 도로명 주소 우선, 없으면 지번 주소 사용
    const finalAddress = roadAddress || jibunAddress;
    
    // 좌표 정보 가져오기 (실패해도 주소 선택은 진행)
    const coordinates = await getCoordinates(finalAddress);
    
    let addressData: AddressData;
    
    if (coordinates) {
      addressData = {
        zipCode: zonecode,
        address: finalAddress,
        sigunguCode: finalSigunguCode,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude
      };
    } else {
      // 좌표 변환 실패 시 기본값 사용
      addressData = {
        zipCode: zonecode,
        address: finalAddress,
        sigunguCode: finalSigunguCode,
        latitude: 37.5665, // 서울시청 위도 (기본값)
        longitude: 126.9780 // 서울시청 경도 (기본값)  
      };
    }
    
    onAddressSelect(addressData);
  };

  const openPostcode = () => {
    if (!isScriptLoaded || !window.daum) {
      alert('주소 검색 서비스를 로딩 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }
    
    // Daum Postcode 팝업 생성
    new window.daum.Postcode({
      oncomplete: handleComplete,
      width: '100%',
      height: '100%'
    }).open();
  };

  return (
    <div>
      <Button
        type="button"
        onClick={openPostcode}
        disabled={disabled || !isScriptLoaded}
        variant="outline"
        className="w-full"
      >
        {!isScriptLoaded ? '🔄 로딩 중...' : '📍 주소 검색'}
      </Button>
      
      {!isScriptLoaded && (
        <p className="text-sm text-gray-500 mt-1">주소 검색 서비스를 준비 중입니다...</p>
      )}
    </div>
  );
}