import React, { useRef, useEffect } from 'react';
import styles from './index.scss';

export const Logger = ({ id, children }) => {
  const loggerRef = useRef(null);

  useEffect(() => {
    loggerRef.current.scrollTop = loggerRef.current.scrollHeight; // automatically scroll to the bottom
  }, [ children.length ])

  return (
    <div id={id} className={styles.logger__container} ref={loggerRef}>
      {children.map(({ tag, message, id }) => (
        <pre id={id}>{`[${tag}]: ${message}`}</pre>
      ))}
    </div>
  );
};

export default Logger;
