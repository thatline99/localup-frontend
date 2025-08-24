export interface TouristAttractionRanking {
  rank: number;
  name: string;
  latitude: number;
  longitude: number;
  category: string;
  subCategory: string;
}

export interface LastMonthlyTouristAttractionRankingInformation {
  updatedDate: string;
  lastMonthlyTouristAttractionRankingList: TouristAttractionRanking[];
}

export interface VisitorStatistics {
  date: string;
  localVisitors: number;
  domesticVisitors: number;
  foreignVisitors: number;
}

export interface LastYearSameWeekVisitorStatisticsInformation {
  updatedDate: string;
  visitorStatistics: VisitorStatistics[];
}

export interface LocationEvent {
  contentTypeId: string;
  contentId: string;
  title: string;
  startDate: string;
  endDate: string;
  zipCode: string;
  address: string;
  latitude: number;
  longitude: number;
  telephone: string;
  originalImageUrl: string;
  thumbnailImageUrl: string;
}

export interface SigunguMainEventInformation {
  updatedDate: string;
  sigunguMainEvent: LocationEvent | null;
}

export interface OngoingOrUpComingSigunguEventsFromTodayToMonthEndInformation {
  updatedDate: string;
  sigunguEvents: LocationEvent[];
}

export interface DailyWeather {
  date: string;
  condition:
    | "SUNNY"
    | "CLOUDY"
    | "PARTLY_CLOUDY"
    | "RAINY"
    | "SHOWER"
    | "THUNDERSTORM"
    | "SNOW"
    | "FOG";
  minimumTemperature: number;
  maximumTemperature: number;
}

export interface WeatherInformation {
  updatedDate: string;
  dailyWeatherList: DailyWeather[];
}

export interface GetDashboardInformationResponse {
  lastMonthlyTouristAttractionRankingInformation: LastMonthlyTouristAttractionRankingInformation;
  lastYearSameWeekVisitorStatisticsInformation: LastYearSameWeekVisitorStatisticsInformation;
  sigunguMainEventInformation: SigunguMainEventInformation;
  ongoingOrUpComingSigunguEventsFromTodayToMonthEndInformation: OngoingOrUpComingSigunguEventsFromTodayToMonthEndInformation;
  weatherInformation: WeatherInformation;
}
