import React from 'react';
import {
  BatchSize,
  DatadogProvider,
  DatadogProviderConfiguration, DdLogs,
  SdkVerbosity,
  UploadFrequency,
} from '@datadog/mobile-react-native'
import Config from 'react-native-config';
import { DdRumReactNavigationTracking } from '@datadog/mobile-react-navigation'

// Enable Datadog only in production, change to true to test locally
const enabled = !__DEV__

const clientToken = Config.DATADOG_CLIENT_TOKEN;
if (enabled && !clientToken) {
  throw new Error('DATADOG_CLIENT_TOKEN is required');
}

const applicationId = Config.DATADOG_APPLICATION_ID;
if (enabled && !applicationId) {
  throw new Error('DATADOG_APPLICATION_ID is required');
}

const datadogConfig = new DatadogProviderConfiguration(
  clientToken,
  __DEV__ ? 'dev' : 'prod',
  applicationId,
  true, // track User interactions (e.g.: Tap on buttons. You can use 'accessibilityLabel' element property to give tap action the name, otherwise element type will be reported)
  true, // track XHR Resources
  true, // track Errors
);
// Optional: Select your Datadog website (one of "US1", "EU1", "US3", "US5", "AP1" or "GOV")
datadogConfig.site = 'US1';
// Optional: Enable JavaScript long task collection
datadogConfig.longTaskThresholdMs = 100;
// Optional: enable or disable native crash reports
datadogConfig.nativeCrashReportEnabled = true;
// Optional: Sample RUM sessions (% of session are sent to Datadog. Default is 100%).
datadogConfig.sessionSamplingRate = __DEV__ ? 100 : 20;
// Optional: Sample tracing integrations for network calls between your app and your backend (% of calls to your instrumented backend are linked from the RUM view to the APM view. Default is 20%)
// You need to specify the hosts of your backends to enable tracing with these backends
datadogConfig.resourceTracingSamplingRate = __DEV__ ? 100 : 20;
datadogConfig.telemetrySampleRate = 0;
datadogConfig.firstPartyHosts = ['coopcycle.org']; // matches 'example.com' and subdomains like 'api.example.com'
// Optional: let the SDK print internal logs above or equal to the provided level. Default is undefined (meaning no logs)
datadogConfig.verbosity = __DEV__ ? SdkVerbosity.DEBUG : SdkVerbosity.WARN;

if (__DEV__) {
  // Optional: Send data more frequently
  datadogConfig.uploadFrequency = UploadFrequency.FREQUENT;
  // Optional: Send smaller batches of data
  datadogConfig.batchSize = BatchSize.SMALL;
}

export function DatadogWrapper({ children }) {
  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <DatadogProvider configuration={datadogConfig}>{children}</DatadogProvider>
  );
}

const viewNamePredicate = function customViewNamePredicate(route, trackedName) {
  // return custom view name or null to use the previous RUM view
  return trackedName
}

export function navigationContainerOnReady(navigationRef) {
  if (!enabled) {
    return;
  }

  DdRumReactNavigationTracking.startTrackingViews(navigationRef.current, viewNamePredicate)
}

export const DatadogLogger = {
  /**
   * Send a log with debug level.
   * @param message: The message to send.
   * @param context: The additional context to send.
   */
  debug(message, context) {
    if (!enabled) {
      console.debug(message, context);
      return;
    }

    DdLogs.debug(message, context)
  },

  /**
   * Send a log with info level.
   * @param message: The message to send.
   * @param context: The additional context to send.
   */
  info(message, context) {
    if (!enabled) {
      console.info(message, context);
      return;
    }

    DdLogs.info(message, context)
  },

  /**
   * Send a log with warn level.
   * @param message: The message to send.
   * @param context: The additional context to send.
   */
  warn(message, context) {
    if (!enabled) {
      console.warn(message, context);
      return;
    }

    DdLogs.warn(message, context)
  },

  /**
   * Send a log with error level.
   * @param message: The message to send.
   * @param context: The additional context to send.
   */
  error(message, context) {
    if (!enabled) {
      console.error(message, context);
      return;
    }

    DdLogs.error(message, context)
  }
};
