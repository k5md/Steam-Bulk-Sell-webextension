import React, { useRef, useEffect } from 'react';
const styles = require('./index.scss');
import { observer } from "mobx-react";

export const Logger = observer(({ logs, id }) => {
  const loggerRef = useRef(null);

  useEffect(() => {
    loggerRef.current.scrollTop = loggerRef.current.scrollHeight; // automatically scroll to the bottom
  }, [logs]);

  return (
    <div id={id} className={styles.logger__container} ref={loggerRef}>
      {logs.map(({ tag, message }) => (
        <pre>{`[${tag}]: ${message}`}</pre>
      ))}
    </div>
  );
});

export default Logger;
