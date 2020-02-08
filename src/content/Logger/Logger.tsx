import React, { useRef, useEffect } from 'react';
import * as styles from './index.css';

export const Logger = ({ logs }) => {
  const loggerRef = useRef(null);

  useEffect(() => {
    loggerRef.current.scrollTop = loggerRef.current.scrollHeight; // automatically scroll to the bottom
  }, [logs]);

  return (
    <div style={styles.logger__container} ref={loggerRef}>
      {logs.map(({ tag, message }) => (
        <pre>{`[${tag}]: ${message}`}</pre>
      ))}
    </div>
  );
};

export default Logger;
