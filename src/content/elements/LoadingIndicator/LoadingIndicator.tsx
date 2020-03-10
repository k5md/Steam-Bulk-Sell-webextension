import React from 'react';
import cn from 'classnames';
import styles from './index.scss';

export interface Props {
  text: string;
  indicator: string;
  className?: string;
}

export const LoadingIndicator: React.FC<Props> = ({ text, indicator, className }) => (
  <div className={cn(styles.indicator_container, className)}>
    <div className={styles.indicator_progress}>
      <img src={indicator} />
    </div>
    <div className={styles.indicator_text}>
      <p>{text}</p>
    </div>
  </div>
);

export default LoadingIndicator;