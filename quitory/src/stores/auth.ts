import { generateAvatar } from './avatar.js';

const API_URL = 'https://r651873zn7.execute-api.us-east-1.amazonaws.com/quitory/auth/login';
const STORAGE_KEY = 'currentUser';
const DEVICE_KEY = 'deviceid';

function generateDeviceId() {
  return (
    'dev-' +
    'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    })
  );
}

function generateRandomName() {
  return 'User' + Math.floor(Math.random() * 10000);
}

export function getCurrentUser() {
  const userData = localStorage.getItem(STORAGE_KEY);
  return userData ? JSON.parse(userData) : null;
}

export function logout() {
  localStorage.removeItem(STORAGE_KEY);
}

export function getDeviceId() {
  let deviceId = localStorage.getItem(DEVICE_KEY);
  if (!deviceId) {
    deviceId = generateDeviceId();
    localStorage.setItem(DEVICE_KEY, deviceId);
  }
  return deviceId;
}

export async function login() {
  // Step 1: already logged in
  const currentUser = getCurrentUser();
  if (currentUser) {
    console.log('Welcome back!', currentUser);
    return currentUser;
  }

  // Step 2: prepare device + new user info
  let deviceid = localStorage.getItem(DEVICE_KEY);
  let name, avatar;
  const isNewDevice = !deviceid;

  if (!deviceid) {
    deviceid = generateDeviceId();
    name = generateRandomName();
    avatar = generateAvatar(deviceid, 128);
  }

  // Step 3: call API
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deviceid,
        name,
        avatar,
      }),
      mode: "cors"
    });

    const result = await response.json();

    if (result.code === 200) {
      // Step 4: save local only if success
      localStorage.setItem(DEVICE_KEY, deviceid);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(result.data));

      if (isNewDevice) {
        console.log('New user registered:', result.data);
      } else {
        console.log('Welcome back!', result.data);
      }

      return result.data;
    } else {
      console.error('Login failed:', result.message);
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}