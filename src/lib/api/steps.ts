import { api } from "./client";
import type {
  Step,
  LogStepsRequest,
  TodayStepsResponse,
  StepsHistoryResponse,
} from "@/types";

export async function logSteps(data: LogStepsRequest): Promise<{ step: Step }> {
  return api.post<{ step: Step }>("/api/steps", data);
}

export async function getTodaySteps(): Promise<TodayStepsResponse> {
  return api.get<TodayStepsResponse>("/api/steps/today");
}

interface GetStepsHistoryParams {
  start_date?: string;
  end_date?: string;
  limit?: number;
  offset?: number;
}

export async function getStepsHistory(
  params?: GetStepsHistoryParams
): Promise<StepsHistoryResponse> {
  const queryParams: Record<string, string> = {};
  if (params?.start_date) queryParams.start_date = params.start_date;
  if (params?.end_date) queryParams.end_date = params.end_date;
  if (params?.limit) queryParams.limit = params.limit.toString();
  if (params?.offset) queryParams.offset = params.offset.toString();

  return api.get<StepsHistoryResponse>("/api/steps", { params: queryParams });
}
