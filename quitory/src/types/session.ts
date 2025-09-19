export interface VapingSession {
  id: number;
  startTime: string; // ISO date string
  duration?: number; // in minutes
  moneySpent?: number; // in dollars
  triggers: string[]; // e.g., ["stress", "social", "boredom"]
}

export interface CravingSession {
  id: number;
  startTime: string; // ISO date string
  duration: number; // in minutes
  activityIds: {
    // IDs of activities taken during craving
    effective: string[]; // IDs of effective activities
    ineffective: string[]; // IDs of ineffective activities
  };
  triggers: string[]; // e.g., ["stress", "boredom"]
}
