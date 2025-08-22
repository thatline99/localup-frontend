export interface HourlyShortTermForecast {
  time: string;
  precipitationProbability: number | null;
  precipitationType: "NONE" | "RAIN" | "RAIN_SNOW" | "SNOW" | null;
  precipitationAmount: "NONE" | string | null;
  humidity: number | null;
  snowfallAmount: "NONE" | string;
  skyCondition:
    | "SUNNY"
    | "CLOUDY"
    | "PARTLY_CLOUDY"
    | "RAINY"
    | "SHOWER"
    | "THUNDERSTORM"
    | "SNOW"
    | "FOG";
  temperature: number | null;
  windUComponent: number | null;
  windVComponent: number | null;
  waveHeight: number | null;
  windDirection: number | null;
  windSpeed: number | null;
  windSpeedType: "WEAK" | "MODERATE" | "STRONG";
}

export interface ShortTermForecast {
  date: string;
  dailyMinimumTemperature: number | null;
  dailyMaximumTemperature: number | null;
  hourlyShortTermForecasts: HourlyShortTermForecast[];
}

export interface ShortTermForecastData {
  updatedDate: string;
  shortTermForecasts: ShortTermForecast[];
}

export interface GetShortTermForecastResponse {
  code: string;
  message: string;
  data: ShortTermForecastData;
}
