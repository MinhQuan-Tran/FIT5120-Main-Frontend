export default interface Achievement {
  id: string;
  name: string;
  type: AchievementType;
  icon: string; // URL or path to the icon image
  color: string; // Hex color code for the achievement badge
  description: string;
  timeEarned: string; // ISO date strings when the achievement was earned
}

export enum AchievementType {
  Personal = 'personal',
  Group = 'group',
}
