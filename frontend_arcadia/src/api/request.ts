import apiClient from "./client";
import type { AxiosRequestConfig } from "axios";

export async function getRequest<T>(
    endpoint: string,
    config?: AxiosRequestConfig
): Promise<T> {
    const { data } = await apiClient.get<T>(endpoint, config)
    return data
}

export async function postRequest <B, T> (
    endpoint: string,
    body: B,
    config?: AxiosRequestConfig
): Promise<T> {
    const { data } = await apiClient.post<T>(endpoint, body, config)
    return data
}