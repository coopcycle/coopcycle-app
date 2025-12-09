// API Types for RTK Query endpoints

export type Uri = string;

// Base JSON-LD entity interface
export interface JsonLdEntity {
  '@id': Uri;
  '@type': string;
}

// Common Hydra JSON-LD response structure
export interface HydraCollection<T> {
  'hydra:member': T[];
  'hydra:totalItems': number;
  'hydra:view'?: {
    '@id': Uri;
    '@type': string;
    'hydra:first'?: string;
    'hydra:last'?: string;
    'hydra:previous'?: string;
    'hydra:next'?: string;
  };
}

export interface HydraError {
  '@type': string;
  'hydra:title': string;
  'hydra:description': string;
}

export type GeoCoordinates = {
  latitude: number;
  longitude: number;
};

export type Package = JsonLdEntity & {
  id: number;
  name: string;
  volumeUnits: number;
  packageSet?: PackageSet;
};

export type PackageSet = {
  id: number;
  name: string;
};

export type Address = JsonLdEntity & {
  id: number;
  streetAddress: string;
  addressLocality: string;
  addressCountry: string;
  addressRegion?: string;
  postalCode: string;
  geo: GeoCoordinates;
  name?: string;
  description?: string;
  contactName?: string;
  telephone?: string;
  company?: string;
};

export type TimeSlot = JsonLdEntity & {
  id: number;
  name: string;
  interval: string;
  workingDaysOnly: boolean;
  priorNotice?: string;
  openingHours?: string[];
  choices?: TimeSlotChoice[];
};

export type StoreTimeSlot = JsonLdEntity & {
  id: number;
  name: string;
};

export type TimeSlotChoice = {
  // "2025-07-24T07:00:00Z/2025-07-25T06:59:00Z"
  value: string;
  label: string;
};

export type TimeSlotChoices = {
  choices: TimeSlotChoice[];
};

export type Store = JsonLdEntity & {
  id: number;
  name: string;
  enabled: boolean;
  address: Address;
  timeSlot?: Uri;
  timeSlots: Uri[];
  pricingRuleSet?: Uri;
  prefillPickupAddress: boolean;
  weightRequired: boolean;
  packagesRequired: boolean;
  multiDropEnabled: boolean;
  multiPickupEnabled: boolean;
};
