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
