import React from 'react';
import { Card, Guide } from 'popup/elements';
import styles from 'popup/index.scss';

export const App: React.FC = () => (
  <Card title="Steam Bulk Sell" styles={{ container: styles.popup__container }}>
    <Guide />
  </Card>
);

export default App;
