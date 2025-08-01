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
