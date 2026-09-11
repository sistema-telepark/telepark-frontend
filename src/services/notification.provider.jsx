import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { Modal, Toast, ToastContainer } from 'react-bootstrap';
import styles from '../styles/notification-provider.module.css';

const NotificationContext = createContext(null);

let dispatcher = null;

export const getNotificationDispatcher = () => dispatcher;

const setNotificationDispatcher = (next) => {
  dispatcher = next;
};

export const useNotifications = () => useContext(NotificationContext);

const VARIANT_MAP = {
  success: 'success',
  error: 'danger',
  danger: 'danger',
  warning: 'warning',
  info: 'info',
};

const normalizeVariant = (variant) => VARIANT_MAP[variant] || 'info';

const DEFAULT_TOAST_MS = 3000;

export const NotificationProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [confirmState, setConfirmState] = useState(null);
  const [alertState, setAlertState] = useState(null);
  const idRef = useRef(0);

  const pushToast = useCallback((variant, title, options = {}) => {
    const id = (idRef.current += 1);
    const autoHideMs = options.autoHideMs ?? options.timer ?? DEFAULT_TOAST_MS;
    setToasts((prev) => [
      ...prev,
      { id, variant: normalizeVariant(variant), title, message: options.message, autoHideMs },
    ]);
  }, []);

  const openConfirm = useCallback((options = {}) => {
    return new Promise((resolve) => {
      setConfirmState({
        title: options.title,
        message: options.message,
        confirmLabel: options.confirmLabel,
        cancelLabel: options.cancelLabel,
        variant: normalizeVariant(options.variant || 'warning'),
        resolve,
      });
    });
  }, []);

  const openAlert = useCallback((variant, title, message, options = {}) => {
    return new Promise((resolve) => {
      setAlertState({
        variant: normalizeVariant(variant),
        title,
        message,
        autoHideMs: options.autoHideMs,
        resolve,
      });
    });
  }, []);

  useEffect(() => {
    setNotificationDispatcher({ pushToast, openConfirm, openAlert });
    return () => setNotificationDispatcher(null);
  }, [pushToast, openConfirm, openAlert]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const resolveConfirm = useCallback((confirmed) => {
    setConfirmState((current) => {
      if (current) current.resolve(confirmed);
      return null;
    });
  }, []);

  const closeAlert = useCallback(() => {
    setAlertState((current) => {
      if (current) current.resolve();
      return null;
    });
  }, []);

  useEffect(() => {
    if (!alertState?.autoHideMs) return undefined;
    const timer = setTimeout(closeAlert, alertState.autoHideMs);
    return () => clearTimeout(timer);
  }, [alertState, closeAlert]);

  const value = useMemo(
    () => ({ pushToast, openConfirm, openAlert }),
    [pushToast, openConfirm, openAlert]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}

      <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1090 }}>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            bg={toast.variant}
            autohide
            delay={toast.autoHideMs}
            onClose={() => removeToast(toast.id)}
          >
            <Toast.Header closeButton>
              <strong className="me-auto">{toast.title}</strong>
            </Toast.Header>
            {toast.message && (
              <Toast.Body className={toast.variant === 'warning' ? '' : 'text-white'}>
                {toast.message}
              </Toast.Body>
            )}
          </Toast>
        ))}
      </ToastContainer>

      <Modal
        show={!!confirmState}
        onHide={() => resolveConfirm(false)}
        aria-labelledby="notification-confirm-title"
      >
        {confirmState && (
          <>
            <Modal.Header className="justify-content-center">
              <h4 className="mb-0" id="notification-confirm-title">
                {confirmState.title}
              </h4>
            </Modal.Header>
            {confirmState.message && <Modal.Body>{confirmState.message}</Modal.Body>}
            <Modal.Footer className="justify-content-center">
              <button
                type="button"
                className={`btn btn-rojo ${styles.actionButton}`}
                onClick={() => resolveConfirm(false)}
              >
                {confirmState.cancelLabel || 'Cancelar'}
              </button>
              <button
                type="button"
                className={`btn btn-verde ms-3 ${styles.actionButton}`}
                onClick={() => resolveConfirm(true)}
              >
                {confirmState.confirmLabel || 'Sí'}
              </button>
            </Modal.Footer>
          </>
        )}
      </Modal>

      <Modal show={!!alertState} onHide={closeAlert} aria-labelledby="notification-alert-title">
        {alertState && (
          <>
            <Modal.Header className="justify-content-center">
              <h4 className="mb-0" id="notification-alert-title">
                {alertState.title}
              </h4>
            </Modal.Header>
            {alertState.message && <Modal.Body>{alertState.message}</Modal.Body>}
            <Modal.Footer className="justify-content-center">
              <button
                type="button"
                className={`btn btn-verde ${styles.actionButton}`}
                onClick={closeAlert}
              >
                Aceptar
              </button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </NotificationContext.Provider>
  );
};

NotificationProvider.propTypes = {
  children: PropTypes.node,
};

export default NotificationProvider;
