import { atom } from 'recoil';

export const userState = atom({
  key: 'userState', // unique ID
  default: null, // default value (null = not authenticated)
}); 