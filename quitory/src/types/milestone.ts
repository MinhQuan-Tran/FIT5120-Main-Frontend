export default interface Milestone {
  id: string;
  start_time: string; // ISO 8601 date string
  duration: number; // in days
  status: 'active' | 'success' | 'failed';
  targets: MilestoneTarget[];
}

export interface MilestoneTarget {
  type: string;
  name: string; // e.g., "Run 5km"
  target: number;
  value: number; // current progress
}
