import API from '../API';

class HttpClientService {
  private httpClient = null;

  /**
   * Creates or updates the HTTP client based on the provided configuration
   */
  updateClient(
    baseURL: string | null,
    token: string = '',
    refreshToken: string = '',
    callbacks: {
      onCredentialsUpdated?: (credentials) => void;
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
  getClient() {
    return this.httpClient;
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
