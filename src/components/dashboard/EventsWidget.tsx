'use client';

import { useEffect, useState } from 'react';
import { getDashboard } from '@/app/lib/api/dashboard/dashboard';
import { LocationEvent } from '@/types/dashboard/getDashboardInformationResponse';

export const EventsWidget = () => {
  const [events, setEvents] = useState<LocationEvent[]>([]);
  const [mainEvent, setMainEvent] = useState<LocationEvent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await getDashboard();
        if (response.code === 'SUCCESS' && response.data) {
          setMainEvent(response.data.sigunguMainEventInformation?.sigunguMainEvent || null);
          setEvents(
            response.data.ongoingOrUpComingSigunguEventsFromTodayToMonthEndInformation?.sigunguEvents || []
          );
        }
      } catch (error) {
        // 에러 발생 시 빈 데이터로 처리
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const getEventStatus = (startDate: string, endDate: string) => {
    const today = new Date().toISOString().split('T')[0];
    if (startDate <= today && endDate >= today) {
      return { text: '진행중', className: 'bg-green-100 text-green-800' };
    }
    if (startDate > today) {
      return { text: '예정', className: 'bg-blue-100 text-blue-800' };
    }
    return { text: '종료', className: 'bg-gray-100 text-gray-800' };
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-neutral-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-4">
                <div className="h-20 w-20 bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const displayEvents = mainEvent 
    ? [mainEvent, ...events.filter(e => e.contentId !== mainEvent.contentId)].slice(0, 5)
    : events.slice(0, 5);

  if (displayEvents.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-neutral-200 p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">
          🎯 지역 이벤트
        </h3>
        <div className="flex items-center justify-center h-48 text-neutral-500">
          <p>현재 진행 중인 이벤트가 없습니다</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-neutral-200 p-6">
      <h3 className="text-lg font-semibold text-neutral-900 mb-4">
        🎯 지역 이벤트
      </h3>
      
      <div className="space-y-4">
        {displayEvents.map((event, index) => {
          const status = getEventStatus(event.startDate, event.endDate);
          const isMain = index === 0 && mainEvent?.contentId === event.contentId;
          
          return (
            <div
              key={event.contentId}
              className={`flex gap-4 p-3 rounded-lg hover:bg-neutral-50 transition-colors ${
                isMain ? 'border border-primary-200 bg-primary-50' : ''
              }`}
            >
              {/* 이벤트 이미지 */}
              <div className="flex-shrink-0">
                {event.thumbnailImageUrl ? (
                  <img
                    src={event.thumbnailImageUrl}
                    alt={event.title}
                    className="w-20 h-20 object-cover rounded-lg"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-20 h-20 bg-neutral-200 rounded-lg flex items-center justify-center">
                    <svg className="w-8 h-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* 이벤트 정보 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="font-medium text-neutral-900 line-clamp-1">
                    {event.title}
                  </h4>
                  <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${status.className}`}>
                    {status.text}
                  </span>
                </div>
                
                <div className="space-y-1 text-sm text-neutral-600">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="line-clamp-1">
                      {event.startDate} ~ {event.endDate}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="line-clamp-1">{event.address}</span>
                  </div>
                </div>

                {isMain && (
                  <div className="mt-2">
                    <span className="text-xs text-primary-600 font-medium">
                      ⭐ 주요 이벤트
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {events.length > 5 && (
        <div className="mt-4 pt-4 border-t border-neutral-200">
          <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            더 많은 이벤트 보기 →
          </button>
        </div>
      )}
    </div>
  );
};