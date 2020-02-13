import React, { useRef, useEffect } from 'react';
import styles from './index.scss';

export const Logger = ({ id, logs }) => {
  const loggerRef = useRef(null);

  useEffect(() => {
    loggerRef.current.scrollTop = loggerRef.current.scrollHeight; // automatically scroll to the bottom
  }, [ logs ]);

  return (
    <div id={id} className={styles.logger__container} ref={loggerRef}>
      {logs.map(({ tag, message }) => (
        <pre>{`[${tag}]: ${message}`}</pre>
      ))}
    </div>
  );
};

export default Logger;