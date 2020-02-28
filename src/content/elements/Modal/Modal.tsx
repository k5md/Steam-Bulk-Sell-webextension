import React, { useEffect, useRef, MouseEventHandler } from 'react';
import styles from './index.scss';

export interface Props {
  id: string;
  open: boolean;
  onOpen?: React.EffectCallback;
  onClose?: React.EffectCallback;
  children?: React.ReactNode;
}

export const Modal: React.FC<Props> = ({
  id,
  open,
  onOpen = (): void => {},
  onClose = (): void => {},
  children = [],
}) => {
  useEffect(onOpen, []);

  const modalRef = useRef(null);
  const backdropClickHandler: MouseEventHandler = (e) => {
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
