export interface BaseResponse<T> {
  code: "SUCCESS" | "FAILURE";
  message: string;
  data: T | null;
}
