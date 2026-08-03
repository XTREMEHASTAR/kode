export interface PublicLaunchConfig {
  launchDate: string; // UTC ISO-8601 string, e.g., "2026-08-15T18:00:00Z"
  launchEnabled: boolean;
  maintenance: boolean;
}

let cachedLaunchConfig: PublicLaunchConfig | null = null;
let fetchPromise: Promise<PublicLaunchConfig> | null = null;

export class LaunchService {
  /**
   * Fetches the public launch configuration from /api/public/launch.
   * Caches in memory so subsequent calls in the same application lifetime return the cached value.
   * Guarantees single inflight request on page load.
   */
  public static async getLaunchConfig(forceRefresh: boolean = false): Promise<PublicLaunchConfig> {
    if (cachedLaunchConfig && !forceRefresh) {
      return cachedLaunchConfig;
    }

    if (fetchPromise && !forceRefresh) {
      return fetchPromise;
    }

    fetchPromise = (async () => {
      try {
        const response = await fetch('/api/public/launch', {
          headers: {
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch launch configuration: ${response.statusText}`);
        }

        const data: PublicLaunchConfig = await response.json();
        
        // Validate ISO string & fallback if invalid
        if (!data || !data.launchDate || isNaN(Date.parse(data.launchDate))) {
          throw new Error('Invalid launch date received from launch configuration service');
        }

        cachedLaunchConfig = {
          launchDate: data.launchDate,
          launchEnabled: Boolean(data.launchEnabled),
          maintenance: Boolean(data.maintenance)
        };

        return cachedLaunchConfig;
      } catch (err) {
        console.warn('[LaunchService] Failed to load launch configuration from API, falling back to static launch date.', err);
        // Resilient fallback state without dynamic random generation
        const fallback: PublicLaunchConfig = {
          launchDate: '2026-08-04T18:30:00Z',
          launchEnabled: false,
          maintenance: false
        };

        cachedLaunchConfig = fallback;
        return fallback;
      } finally {
        fetchPromise = null;
      }
    })();

    return fetchPromise;
  }

  /**
   * Clears the in-memory cache if needed (e.g. after admin updates).
   */
  public static clearCache(): void {
    cachedLaunchConfig = null;
    fetchPromise = null;
  }
}
