export interface VisitorStatistic {
  date: string;
  localVisitors: number;
  domesticVisitors: number;
  foreignVisitors: number;
}

export interface VisitorStatisticsInformation {
  visitorStatistics: VisitorStatistic[];
}

export interface GetVisitorStatisticsRequest {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
}