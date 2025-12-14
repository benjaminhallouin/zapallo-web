/**
 * API Client
 *
 * Core API client class for making HTTP requests to the Zapallo API.
 * Provides base request method with error handling, timeouts, and
 * proper response/error typing.
 */

import { config } from '../config';
import { ApiError, NetworkError, TimeoutError, createApiError } from './errors';

/**
 * HTTP request options
 */
export interface RequestOptions extends Omit<RequestInit, 'body'> {
  /** Request body (will be JSON stringified) */
  body?: unknown;
  /** Custom timeout for this request (ms) */
  timeout?: number;
}

/**
 * API Client class
 *
 * Singleton class for making authenticated HTTP requests to the API.
 * Handles request/response processing, error handling, and timeouts.
 */
export class ApiClient {
  private readonly baseUrl: string;
  private readonly defaultTimeout: number;

  /**
   * Create a new API client instance
   *
   * @param baseUrl - Base URL for API endpoints (defaults to config.apiUrl)
   * @param defaultTimeout - Default timeout in milliseconds (defaults to config.apiTimeout)
   */
  constructor(baseUrl: string = config.apiUrl, defaultTimeout: number = config.apiTimeout) {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
    this.defaultTimeout = defaultTimeout;
  }

  /**
   * Make an HTTP request to the API
   *
   * @param endpoint - API endpoint path (e.g., '/exchanges')
   * @param options - Request options including method, body, headers, etc.
   * @returns Parsed JSON response
   * @throws {ApiError} On HTTP errors or network failures
   */
  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { body, timeout = this.defaultTimeout, ...fetchOptions } = options;

    // Prepend API prefix to endpoint if not already present
    const fullEndpoint = endpoint.startsWith(config.apiPrefix)
      ? endpoint
      : `${config.apiPrefix}${endpoint}`;
    const url = `${this.baseUrl}${fullEndpoint}`;

    // Setup abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': config.apiKey,
          ...fetchOptions.headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle HTTP errors
      if (!response.ok) {
        const errorData = await this.parseErrorResponse(response);
        const message = this.extractErrorMessage(errorData);
        throw createApiError(response.status, message, errorData);
      }

      // Handle successful response
      // Check for 204 No Content first (no body to parse)
      if (response.status === 204) {
        return undefined as T;
      }

      // Check if response has content
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }

      // For other empty responses
      return undefined as T;
    } catch (error) {
      clearTimeout(timeoutId);

      // Re-throw if already an ApiError
      if (error instanceof ApiError) {
        throw error;
      }

      // Handle abort/timeout errors
      if (error instanceof Error && error.name === 'AbortError') {
        throw new TimeoutError(`Request timeout after ${timeout}ms: ${url}`, error);
      }

      // Handle network errors
      throw new NetworkError(`Network request failed: ${url}`, error);
    }
  }

  /**
   * Parse error response body
   *
   * @param response - Fetch response object
   * @returns Parsed error data or undefined
   */
  private async parseErrorResponse(response: Response): Promise<unknown> {
    try {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      return { detail: await response.text() };
    } catch {
      return undefined;
    }
  }

  /**
   * Extract error message from error response
   *
   * @param errorData - Parsed error response data
   * @returns Human-readable error message
   */
  private extractErrorMessage(errorData: unknown): string {
    // Handle FastAPI error format
    if (errorData && typeof errorData === 'object') {
      const data = errorData as Record<string, unknown>;

      if (typeof data.detail === 'string') {
        return data.detail;
      }

      // Handle validation errors
      if (Array.isArray(data.detail)) {
        return data.detail
          .map((err: { msg?: string; loc?: string[] }) => err.msg || 'Validation error')
          .join(', ');
      }
    }

    return 'An unexpected error occurred';
  }

  /**
   * Make a GET request
   *
   * @param endpoint - API endpoint path
   * @param options - Request options
   * @returns Parsed JSON response
   */
  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  /**
   * Make a POST request
   *
   * @param endpoint - API endpoint path
   * @param body - Request body
   * @param options - Request options
   * @returns Parsed JSON response
   */
  async post<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body });
  }

  /**
   * Make a PUT request
   *
   * @param endpoint - API endpoint path
   * @param body - Request body
   * @param options - Request options
   * @returns Parsed JSON response
   */
  async put<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body });
  }

  /**
   * Make a PATCH request
   *
   * @param endpoint - API endpoint path
   * @param body - Request body
   * @param options - Request options
   * @returns Parsed JSON response
   */
  async patch<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', body });
  }

  /**
   * Make a DELETE request
   *
   * @param endpoint - API endpoint path
   * @param options - Request options
   * @returns Parsed JSON response (usually void)
   */
  async delete<T = void>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

/**
 * Default API client instance
 *
 * Singleton instance configured with default settings from config.
 * Can be imported and used directly throughout the application.
 */
export const apiClient = new ApiClient();
