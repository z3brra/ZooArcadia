import apiClient from "./client";
import type { AxiosRequestConfig } from "axios";

export async function postRequest <B, T> (
    endpoint: string,
    body: B,
    config?: AxiosRequestConfig
): Promise<T> {
    const { data } = await apiClient.post<T>(endpoint, body, config)
    return data
}