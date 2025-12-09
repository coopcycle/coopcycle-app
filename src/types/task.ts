//FIXME: move into src/redux/api/types.ts

// ====== TASK TYPES ======

import { LucideIcon } from 'lucide-react-native';
import { Uri } from '@/src/redux/api/types';

/**
 * Task status enumeration
 */
export type TaskStatus = 'TODO' | 'DOING' | 'DONE' | 'FAILED' | 'CANCELLED';

/**
 * Task type enumeration
 */
export type TaskType = 'PICKUP' | 'DROPOFF';

/**
 * Geographic coordinates interface
 */
export interface GeoCoordinates {
  '@type': 'GeoCoordinates';
  latitude: number;
  longitude: number;
}

/**
 * Address interface following schema.org/Place
 */
export interface TaskAddress {
  '@id': string;
  '@type': 'http://schema.org/Place';
  contactName: string | null;
  description: string | null;
  firstName: string | null;
  geo: GeoCoordinates;
  lastName: string | null;
  name: string | null;
  streetAddress: string;
  telephone: string;
}

/**
 * Barcode label interface
 */
export interface BarcodeLabel {
  token: string;
  url: string;
}

/**
 * Barcode interface
 */
export interface TaskBarcode {
  barcode: string;
  label: BarcodeLabel;
}

/**
 * Package interface
 */
export interface TaskPackage {
  labels: string[];
  name: string;
  quantity: number;
  short_code: string;
  type: string;
  volume_per_package: number;
}

/**
 * Task metadata interface
 */
export interface TaskMetadata {
  delivery_position?: number;
  store?: Uri;
  order_number?: string;
  order_total?: number;
  zero_waste?: boolean;
  payment_method?: string;
  order_distance?: string;
  order_duration?: string;
  polyline?: string;
}

/**
 * Task tag interface
 */
export interface TaskTag {
  id: number;
  name: string;
  slug: string;
  color: string;
}

/**
 * Task incident interface
 */
export interface TaskIncident {
  id: number;
  title: string;
  description?: string;
  createdAt: string;
}

/**
 * Task image interface
 */
export interface TaskImage {
  id: number;
  url: string;
  thumbnail?: string;
  createdAt: string;
}

/**
 * User/Courier interface for assignedTo field
 */
export interface TaskAssignee {
  '@id': string;
  '@type': string;
  id: number;
  username: string;
  email?: string;
}

/**
 * Task group interface
 */
export interface TaskGroup {
  '@id': string;
  '@type': string;
  id: number;
  name: string;
}

/**
 * Main Task interface
 */
export interface Task {
  '@id': string;
  '@type': 'Task';
  id: number;

  // Address information
  address: TaskAddress;

  // Time-related fields
  after: string; // ISO date string
  before: string; // ISO date string
  doneAfter: string; // ISO date string
  doneBefore: string; // ISO date string
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string

  // Assignment and status
  assignedTo: TaskAssignee | null;
  status: TaskStatus;
  type: TaskType;
  isAssigned: boolean;

  // Identification and tracking
  barcode: TaskBarcode;
  color: string; // Hex color code
  ref: string | null;

  // Content and description
  comments: string;
  orgName: string | null;
  metadata: TaskMetadata;

  // Packages and logistics
  packages: TaskPackage[];
  weight: number; // Weight in the actual data is always a number (can be 0)
  doorstep: boolean;

  // Incidents and issues
  hasIncidents: boolean;
  incidents: TaskIncident[];
  images: TaskImage[];

  // Navigation and relationships
  next: string | null; // API reference to next task
  previous: string | null; // API reference to previous task
  group: TaskGroup | null;

  // Recurrence and scheduling
  recurrenceRule: string | null; // API reference to recurrence rule

  // Tags and categorization
  tags: TaskTag[];

  // Metrics and tracking
  emittedCo2: number;
  traveledDistanceMeter: number;
}

/**
 * Task creation payload interface
 */
type BaseTaskFields = {
  address: Omit<TaskAddress, '@id' | '@type'>;
  comments?: string;
  packages?: Omit<TaskPackage, 'labels'>[];
  tags?: number[];
  weight?: number;
  doorstep?: boolean;
};

export type BaseTimeSlotFields = {
  timeSlotUrl: Uri;
  timeSlot: string;
  after?: never;
  before?: never;
};

export type BaseDateTimeFields = {
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

export type EditTaskFields = CreateAnyTaskPayload

export type EditTaskPayload = Partial<CreateAnyTaskPayload>

/**
 * Task update payload interface
 */
export interface UpdateTaskPayload {
  address?: Partial<Omit<TaskAddress, '@id' | '@type'>>;
  after?: string;
  before?: string;
  comments?: string;
  status?: TaskStatus;
  metadata?: Partial<TaskMetadata>;
  weight?: number;
  doorstep?: boolean;
}

/**
 * Task list response interface
 */
export interface TaskListResponse {
  '@context': string;
  '@id': string;
  '@type': 'hydra:Collection';
  'hydra:member': Task[];
  'hydra:totalItems': number;
  'hydra:view'?: {
    '@id': string;
    '@type': 'hydra:PartialCollectionView';
    'hydra:first'?: string;
    'hydra:last'?: string;
    'hydra:next'?: string;
    'hydra:previous'?: string;
  };
}

/**
 * Task filter options interface
 */
export interface TaskFilterOptions {
  status?: TaskStatus[];
  type?: TaskType[];
  assignedTo?: number[];
  tags?: number[];
  after?: string;
  before?: string;
  organization?: string;
}

export interface TaskListProps {
  id: string;
  tasks: Task[];
  nextTask?: Task | null;
  appendTaskListTestID?: string;
  onMultipleSelectionAction?: (items: Task[]) => void;
  onRefresh?: () => void;
  onPressLeft?: (task: Task) => void;
  onPressRight?: (task: Task) => void;
  onSwipeClosed?: (task: Task) => void;
  onSwipeToLeft?: (task: Task) => void;
  onSwipeToRight?: (task: Task) => void;
  onLongPress?: (task: Task) => void;
  onTaskClick: (task: Task) => void;
  onOrderClick: (task: Task) => void;
  onSortBefore?: (tasks: Task[]) => void;
  onSort?: (tasks: Task[], index: number) => void;
  refreshing?: boolean;
  swipeOutLeftBackgroundColor?: string;
  swipeOutLeftIcon?: LucideIcon;
  swipeOutRightBackgroundColor?: string;
  swipeOutRightIcon?: LucideIcon;
}

export interface TaskListItemProps {
  task: Task;
  nextTask?: Task | null;
  color: string;
  index: number;
  taskListId: string;
  appendTaskListTestID?: string;
  onPress?: () => void;
  onLongPress?: TaskListProps['onLongPress'];
  onOrderPress?: () => void;
  onPressLeft?: () => void;
  onPressRight?: () => void;
  onSortBefore?: TaskListProps['onSortBefore'];
  onSort?: TaskListProps['onSort'];
  swipeOutLeftBackgroundColor?: string;
  swipeOutLeftIcon?: LucideIcon;
  swipeOutRightBackgroundColor?: string;
  swipeOutRightIcon?: LucideIcon;
  onSwipedToLeft?: () => void;
  onSwipedToRight?: () => void;
  onSwipeClosed?: () => void;
}

export default Task;
