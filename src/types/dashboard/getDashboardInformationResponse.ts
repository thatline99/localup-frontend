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

export interface GetDashboardInformationResponse {
  lastMonthlyTouristAttractionRankingInformation: LastMonthlyTouristAttractionRankingInformation;
  sigunguMainEventInformation: SigunguMainEventInformation;
  ongoingOrUpComingSigunguEventsFromTodayToMonthEndInformation: OngoingOrUpComingSigunguEventsFromTodayToMonthEndInformation;
}
