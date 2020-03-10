import React from 'react';
import { observer } from 'mobx-react-lite';
import { SellModalItemsList, SellModalItemsListProps } from './SellModalItemsList';
import { SellModalControls, SellModalControlsProps } from './SellModalControls';
import { Modal } from '../';
import styles from './index.scss';

export type SellModalProps = SellModalControlsProps & SellModalItemsListProps & {
  id: string;
  open: boolean;
}

export const SellModal: React.FC<SellModalProps> = observer(({
  id,
  sellHandler,
  closeHandler,
  clearHandler,
  open,
  multiplyModifier,
  setMultiplyModifier,
  priceModifier,
  setPriceModifier,
  items,
  total,
  fetchedItems,
}) => (
    <Modal
      open={open}
      id={id}
      onClose={closeHandler}
    >
      <div className={styles.modal_inner}>
        <SellModalItemsList
          items={items}
          total={total}
          priceModifier={priceModifier}
        />
        <SellModalControls
          sellHandler={sellHandler}
          closeHandler={closeHandler}
          clearHandler={clearHandler}
          multiplyModifier={multiplyModifier}
          setMultiplyModifier={setMultiplyModifier}
          priceModifier={priceModifier}
          setPriceModifier={setPriceModifier}
          fetchedItems={fetchedItems}
        />
      </div>
    </Modal>
));

export default SellModal;
