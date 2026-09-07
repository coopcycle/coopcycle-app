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

export type StorePackage = JsonLdEntity & {
  name: string;
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

export type Warehouse = JsonLdEntity & {
  id: number;
  name: string;
  address: Address;
};

export type PaymentMethod = {
  type: string;
};

export type PaymentMethodsOutput = {
  methods: PaymentMethod[];
};

export type PricingRuleTarget = 'DELIVERY' | 'TASK' | 'LEGACY_TARGET_DYNAMIC';

export type PricingRule = JsonLdEntity & {
  id: number;
  target: PricingRuleTarget;
  position: number;
  name?: string;
  expression: string;
  expressionAst: object;
  price: string;
  priceAst: object;
};

export type PricingRuleSet = JsonLdEntity & {
  id: number;
  name: string;
  strategy: string;
  // options: Record<string, any>
  rules: PricingRule[];
};

/**
 * Task status enumeration
 */
export type TaskStatus = 'TODO' | 'DOING' | 'DONE' | 'FAILED' | 'CANCELLED';

/**
 * Task type enumeration
 */
export type TaskType = 'PICKUP' | 'DROPOFF';

export type PostDeliveryBody = {
  store: Uri;
  pickup: CreatePickupOrDropoffTaskPayload;
  dropoff: CreatePickupOrDropoffTaskPayload;
  order?: OrderPayload;
};

type BaseAddressFields = {
  streetAddress: string;
  geo: Omit<GeoCoordinates, '@type'>;
  name: string;
  contactName: string;
  telephone: string;
  description: string;
}

type BaseTaskFields = {
  address: BaseAddressFields;
  comments?: string;
  packages?: { type: string; quantity: number }[];
  tags?: number[];
  weight?: number;
  doorstep?: boolean;
};

type BaseTimeSlotFields = {
  timeSlotUrl: Uri;
  timeSlot: string;
  after?: never;
  before?: never;
};

type BaseDateTimeFields = {
  after?: string;
  before: string;
  timeSlotUrl?: never;
  timeSlot?: never;
};

export type CreatePickupOrDropoffTaskPayload = BaseTaskFields & (
  | BaseTimeSlotFields
  | BaseDateTimeFields
  );

export type CreateAnyTaskPayload = CreatePickupOrDropoffTaskPayload & {
  type: TaskType;
};

export type PutDeliveryBody = {
  store: Uri,
  pickup?: EditTaskPayload;
  dropoff?: EditTaskPayload;
  tasks?: EditTaskPayload[];
  order?: OrderPayload;
}

export type EditTaskPayload = Partial<CreateAnyTaskPayload> & {
  id: number;
}

export type OrderPayload = {
  manualSupplements?: ManualSupplementValues[];
  paymentMethod?: string;
  arbitraryPrice?: {
    variantName: string;
    variantPrice: number;
  };
};

export type ManualSupplementValues = {
  pricingRule: Uri;
  quantity: number;
};

export type FailureReasonMetadata = {
  type?: string;
  name: string;
  value: unknown;
  label?: string;
};

export type FailureReason = {
  code: string;
  description: string;
  metadata?: FailureReasonMetadata[];
};

export type Incident = JsonLdEntity & {
  id: number;
  title?: string;
  status: string;
  priority: number;
  failureReasonCode?: string;
  description?: string;
  events: IncidentEvent[];
  createdBy?: Uri;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt?: string;
};

export type IncidentEvent = {
  id: number;
  type: string;
  message?: string;
  metadata: Record<string, unknown>;
  createdBy?: Uri;
  createdAt: string;
};

export type IncidentPayload = {
  description: string;
  failureReasonCode: string;
  task: Uri;
  metadata?: SuggestionPayload | unknown[];
};

export type SuggestionPayload = {
  suggestion: IncidentMetadataSuggestion;
};

export type IncidentMetadataSuggestion = {
  id?: number; // Delivery id
  // tasks: TaskPayload[];
  tasks: EditTaskPayload[];
  order: OrderPayload;
};

export type ShiftActivity = JsonLdEntity & {
  id: number;
  slug: string;
  label: string;
  color: string | null;
};

export type ShiftUser = {
  '@id': Uri;
  '@type': string;
  username: string;
};

export type ShiftAssignment = JsonLdEntity & {
  user: ShiftUser;
  createdAt: string;
};

export type ShiftWaitlistEntry = JsonLdEntity & {
  user: ShiftUser;
  createdAt: string;
};

// A shift's own schedule week is not published/visible to couriers unless a
// dispatcher has published it — see the web app's SchedulePublication entity.
export type Shift = JsonLdEntity & {
  id: number;
  // Slug of a ShiftActivity (e.g. "delivery"), not an IRI — see the web app's
  // Shift::$activity.
  activity: string;
  startsAt: string;
  endsAt: string;
  slots: number;
  breakMinutes: number;
  comment?: string | null;
  assignments: ShiftAssignment[];
  waitlist: ShiftWaitlistEntry[];
  requiredSkills: Uri[];
};

export type HolidayRequestStatus = 'pending' | 'approved' | 'rejected';

export type HolidayRequest = JsonLdEntity & {
  id: number;
  startDate: string;
  endDate: string;
  status: HolidayRequestStatus;
  comment?: string | null;
  createdAt: string;
};

export type HolidayRequestPayload = {
  startDate: string;
  endDate: string;
  comment?: string;
};
