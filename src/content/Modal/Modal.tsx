import React, { useEffect, useRef } from 'react';
import * as styles from './index.css';

export const Modal = ({
  open,
  onOpen,
  onClose,
  children,
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
    <div>
      <div className={styles.modal__container} ref={modalRef}>
        {children}
      </div>
      <div className={styles.modal__backdrop} onClick={backdropClickHandler}></div>
    </div>
  );
};

export default Modal;
