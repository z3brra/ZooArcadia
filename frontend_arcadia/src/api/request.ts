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

export async function putRequest <B, T> (
    endpoint: string,
    body: B,
    config?: AxiosRequestConfig
): Promise<T> {
    const { data } = await apiClient.put<T>(endpoint, body, config)
    return data
}

export async function deleteRequest<T>(
    endpoint: string,
    config?: AxiosRequestConfig
): Promise<T> {
    const { data } = await apiClient.delete<T>(endpoint, config);
    return data
}