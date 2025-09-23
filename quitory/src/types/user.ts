export interface User {
  id: string;
  name?: string;
  profilePictureURL?: string;
}

export enum AuthStatus {
  Authenticated = 'authenticated',
  Unauthenticated = 'unauthenticated',
  Loading = 'loading',
}
