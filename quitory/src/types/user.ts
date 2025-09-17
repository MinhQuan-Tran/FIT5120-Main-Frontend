export interface User {
  id: string;
  name: string;
}

export enum AuthStatus {
  Authenticated = 'authenticated',
  Unauthenticated = 'unauthenticated',
  Loading = 'loading',
}
