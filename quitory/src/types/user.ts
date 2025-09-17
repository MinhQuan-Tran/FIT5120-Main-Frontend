export interface User {
  name: string;
}

export enum AuthStatus {
  Authenticated = 'authenticated',
  Unauthenticated = 'unauthenticated',
  Loading = 'loading',
}
