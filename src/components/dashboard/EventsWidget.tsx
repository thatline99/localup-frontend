'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
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
      <Card>
        <CardHeader>
          <CardTitle>지역 이벤트</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-3">
                <div className="h-12 w-12 bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const displayEvents = mainEvent 
    ? [mainEvent, ...events.filter(e => e.contentId !== mainEvent.contentId)].slice(0, 3)
    : events.slice(0, 3);

  if (displayEvents.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>지역 이벤트</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32 text-neutral-500">
            <p className="text-sm">현재 진행 중인 이벤트가 없습니다</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>지역 이벤트</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
        {displayEvents.map((event, index) => {
          const status = getEventStatus(event.startDate, event.endDate);
          const isMain = index === 0 && mainEvent?.contentId === event.contentId;
          
          return (
            <div
              key={event.contentId}
              className={`flex gap-3 p-2 rounded-lg hover:bg-neutral-50 transition-colors ${
                isMain ? 'border border-primary-200 bg-primary-50' : ''
              }`}
            >
              {/* 이벤트 이미지 */}
              <div className="flex-shrink-0">
                {event.thumbnailImageUrl ? (
                  <img
                    src={event.thumbnailImageUrl}
                    alt={event.title}
                    className="w-12 h-12 object-cover rounded"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-12 h-12 bg-neutral-200 rounded flex items-center justify-center">
                    <svg className="w-6 h-6 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* 이벤트 정보 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-medium text-neutral-900 line-clamp-1">
                    {event.title}
                  </h4>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full whitespace-nowrap ${status.className}`}>
                    {status.text}
                  </span>
                </div>
                
                <div className="mt-1 space-y-0.5">
                  <div className="flex items-center gap-1">
                    <svg className="w-3 h-3 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs text-neutral-600 line-clamp-1">
                      {event.startDate} ~ {event.endDate}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <svg className="w-3 h-3 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-xs text-neutral-600 line-clamp-1">{event.address}</span>
                  </div>
                </div>

                {isMain && (
                  <span className="inline-block mt-1 text-xs text-primary-600 font-medium">
                    주요 이벤트
                  </span>
                )}
              </div>
            </div>
          );
        })}
        </div>
      </CardContent>
    </Card>
  );
};