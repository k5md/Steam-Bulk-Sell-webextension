import React, { useRef, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { LoggerEntry } from 'content/stores';
import styles from './index.scss';

export interface Props {
  id: string;
  children: LoggerEntry[];
}

export const Logger = observer(({ id, children }: Props) => {
  const loggerRef = useRef(null);

  useEffect(() => {
    loggerRef.current.scrollTop = loggerRef.current.scrollHeight; // automatically scroll to the bottom
  }, [ children.length ])

  return (
    <div id={id} className={styles.logger__container} ref={loggerRef}>
      {children.map(({ tag, message, id }) => (
        <pre key={id}>{`[${tag}]: ${message}`}</pre>
      ))}
    </div>
  );
});

export default Logger;
