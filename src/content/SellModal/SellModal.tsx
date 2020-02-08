import React from 'react';
import { Modal } from '../Modal';
import { SellModalControls } from './SellModalControls';
import { SellModalItems } from './SellModalItems';
import * as styles from './index.css';
import { BUTTON_SECONDARY } from 'content/constants';

export const SellModal = ({
  onSell,
  onClose,
  onClear,
  items,
  percentageModifier = '+0',
  total = '0',
}) => (
  <Modal>
    <SellModalItems />
    <SellModalControls />
  </Modal>
);
