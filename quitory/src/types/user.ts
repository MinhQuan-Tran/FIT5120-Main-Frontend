export interface User {
  name: string;
  profilePictureURL?: string;
}

export enum AuthStatus {
  Authenticated = 'authenticated',
  Unauthenticated = 'unauthenticated',
  Loading = 'loading',
}
