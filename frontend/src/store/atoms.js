import { atom } from 'recoil';

export const userState = atom({
  key: 'userState_unique',
  default: null,
});

export const reportsState = atom({
  key: 'reportsState',
  default: [],
});

export const loadingState = atom({
  key: 'loadingState',
  default: false,
});

export const emergencyContactsState = atom({
  key: 'emergencyContactsState',
  default: [],
}); 