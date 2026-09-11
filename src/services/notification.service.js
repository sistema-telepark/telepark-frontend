import { getNotificationDispatcher } from './notification.provider';

const dispatch = (method, ...args) => {
  const current = getNotificationDispatcher();
  if (!current || typeof current[method] !== 'function') return undefined;
  return current[method](...args);
};

export const showToast = (variant, title, options = {}) => {
  dispatch('pushToast', variant, title, options);
};

export const showAlert = (variant, title, message, options = {}) => {
  return dispatch('openAlert', variant, title, message, options) ?? Promise.resolve();
};

export const showConfirm = (title, text, options = {}) => {
  const config = title && typeof title === 'object' ? title : { title, message: text, ...options };
  return dispatch('openConfirm', config) ?? Promise.resolve(false);
};
