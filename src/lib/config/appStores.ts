/**
 * App Store Configuration
 *
 * Centralized configuration for app store links.
 * Update URLs here when store listings go live.
 */

export interface StoreConfig {
  /** Store URL (or placeholder) */
  url: string
  /** Whether the store listing is live */
  available: boolean
  /** Store name for display/analytics */
  name: string
}

export interface AppStoreConfig {
  ios: StoreConfig
  android: StoreConfig
}

export const APP_STORE_CONFIG: AppStoreConfig = {
  ios: {
    url: 'https://apps.apple.com/app/domani-plan-tomorrow-tonight/id6740019498',
    available: true,
    name: 'App Store',
  },
  android: {
    url: 'https://play.google.com/store/apps/details?id=com.domani.app',
    available: true,
    name: 'Google Play',
  },
}

/**
 * Get the iOS App Store URL
 */
export function getAppStoreUrl(): string {
  return APP_STORE_CONFIG.ios.url
}

/**
 * Get the Google Play Store URL
 */
export function getPlayStoreUrl(): string {
  return APP_STORE_CONFIG.android.url
}

/**
 * Check if iOS app is available
 */
export function isIosAvailable(): boolean {
  return APP_STORE_CONFIG.ios.available
}

/**
 * Check if Android app is available
 */
export function isAndroidAvailable(): boolean {
  return APP_STORE_CONFIG.android.available
}

/**
 * Check if any platform is available
 */
export function isAnyPlatformAvailable(): boolean {
  return APP_STORE_CONFIG.ios.available || APP_STORE_CONFIG.android.available
}
