export type NoticeVariant = 'success' | 'normal' | 'warning' | 'danger';

export type Notice = {
  id: string;
  title?: string;
  content?: string;
  variant?: NoticeVariant;
  to?: string; // optional link / route / path
  createdAt: number;
};
