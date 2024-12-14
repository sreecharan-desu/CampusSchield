import { atom } from 'recoil';

export const userState = atom({
  key: 'userState', // unique ID
  default: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('token')) : null, // default value (null = not authenticated)
}); 