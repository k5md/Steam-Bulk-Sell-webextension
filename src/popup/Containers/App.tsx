import React from 'react';
import { Card, Guide } from '../Components';
import styles from '../index.scss';

export const App = () => (
  <Card title="Steam Bulk Sell" styles={{ container: styles.popup__container }}>
    <Guide />
  </Card>
);

export default App;
