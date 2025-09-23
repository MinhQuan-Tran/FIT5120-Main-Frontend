export default interface Milestone {
  id: string;
  start_time: Date; // ISO 8601 date string
  duration: number; // in days
  progress: number; // percentage 0-100
  status: 'active' | 'success' | 'failed';
  targets: MilestoneTarget[];
}

export interface MilestoneTarget {
  type: string;
  name: string; // e.g., "Run 5km"
  target: number;
  value: number; // current progress
}
