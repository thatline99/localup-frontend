export interface User {
  id: string;
  email: string;
  name: string;
  businessInfo?: BusinessInfo;
  createdAt: Date;
  updatedAt: Date;
}

export interface BusinessInfo {
  id: string;
  name: string;
  type: BusinessType;
  subType: string;
  registrationNumber: string;
  address: string;
  operatingHours: OperatingHours;
  averagePrice: number;
  capacity: number;
  targetCustomers: string[];
  services: string[];
}

export enum BusinessType {
  RESTAURANT = 'RESTAURANT',
  ACCOMMODATION = 'ACCOMMODATION',
  RETAIL = 'RETAIL',
  EXPERIENCE = 'EXPERIENCE',
}

export enum CustomerSegment {
  FAMILY = 'FAMILY',
  COUPLE = 'COUPLE',
  BUSINESS = 'BUSINESS',
  GROUP = 'GROUP',
  SOLO_TRAVELER = 'SOLO_TRAVELER',
  FOREIGN_TOURIST = 'FOREIGN_TOURIST',
}

export const CustomerSegmentLabels: Record<CustomerSegment, string> = {
  [CustomerSegment.FAMILY]: '가족 단위',
  [CustomerSegment.COUPLE]: '커플/연인',
  [CustomerSegment.BUSINESS]: '비즈니스',
  [CustomerSegment.GROUP]: '단체/모임',
  [CustomerSegment.SOLO_TRAVELER]: '1인 여행객',
  [CustomerSegment.FOREIGN_TOURIST]: '외국인 관광객',
};

export interface OperatingHours {
  [key: string]: {
    open: string;
    close: string;
    isOpen: boolean;
  };
}

export interface DashboardMetrics {
  expectedVisitors: {
    today: number;
    hourly: number[];
    comparedToYesterday: number;
    peakTime: string;
  };
  weatherImpact: {
    forecast: WeatherForecast[];
    impactLevel: 'high' | 'medium' | 'low';
    recommendation: string;
  };
  nearbyEvents: Event[];
  snsTrends: {
    hashtags: { tag: string; count: number }[];
    mentions: number;
    sentiment: 'positive' | 'neutral' | 'negative';
  };
  reviews: {
    positive: number;
    negative: number;
    keywords: string[];
    suggestions: string[];
  };
  competitors: Competitor[];
}

export interface WeatherForecast {
  date: Date;
  weather: string;
  temperature: {
    min: number;
    max: number;
  };
  precipitation: number;
}

export interface Event {
  id: string;
  name: string;
  date: Date;
  distance: number;
  expectedImpact: 'high' | 'medium' | 'low';
  type: string;
}

export interface Competitor {
  id: string;
  name: string;
  type: string;
  rating: number;
  reviewCount: number;
  averagePrice: number;
  distance: number;
}

export interface TrendData {
  period: string;
  visitors: number;
  revenue: number;
  growth: number;
}

export interface Report {
  id: string;
  title: string;
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  createdAt: Date;
  data: Record<string, unknown>;
}

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}