import API, { ApiUser, HttpClient } from '../API';

class HttpClientService {
  private httpClient: HttpClient | null = null;

  /**
   * Creates or updates the HTTP client based on the provided configuration
   */
  updateClient(
    baseURL: string | null,
    token: string = '',
    refreshToken: string = '',
    callbacks: {
      onCredentialsUpdated?: (credentials: ApiUser) => void;
      onTokenRefreshed?: (token: string, refreshToken: string) => void;
      onMaintenance?: (message: string) => void;
    } = {},
  ) {
    if (!baseURL) {
      this.httpClient = null;
      return null;
    }

    // Create new HTTP client
    this.httpClient = API.createClient(baseURL, {
      token,
      refreshToken,
      onCredentialsUpdated: callbacks.onCredentialsUpdated || (() => {}),
      onTokenRefreshed: callbacks.onTokenRefreshed || (() => {}),
      onMaintenance: callbacks.onMaintenance || (() => {}),
    });

    return this.httpClient;
  }

  /**
   * Gets the current HTTP client instance
   */
  getClient(): HttpClient | null {
    return this.httpClient;
  }

  /**
   * Use for testing purposes only!
   */
  setTestClient(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * Clears the current HTTP client
   */
  clear() {
    this.httpClient = null;
  }
}

// Export a singleton instance
export const httpClientService = new HttpClientService();
