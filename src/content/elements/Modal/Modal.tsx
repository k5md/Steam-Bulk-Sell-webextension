import React, { useEffect, useRef } from 'react';
import styles from './index.scss';

export interface ModalProps {
  id: string;
  open: boolean;
  onOpen?: (...args: any[]) => void | React.EffectCallback;
  onClose?: (...args: any[]) => void;
  children?: React.ReactNode[];
}

export const Modal = ({
  id,
  open,
  onOpen = () => {},
  onClose = () => {},
  children = [],
}) => {
  useEffect(onOpen, []);

  const modalRef = useRef(null);
  const backdropClickHandler = (e) => {
    const target  = e.target as Element;
    if (target === modalRef.current && target.closest(modalRef.current)) {
      return;
    }
    onClose();
  };

  return open && (
    <div id={id}>
      <div className={styles.modal__container} ref={modalRef}>
        {children}
      </div>
      <div className={styles.modal__backdrop} onClick={backdropClickHandler}></div>
    </div>
  );
};

export default Modal;
