import React from 'react';
import { observer } from 'mobx-react';
import { SellModal } from '../';
import { useStores } from 'content/stores';

export const SellModalContainer = observer(({ id }) => {
  const { inventory } = useStores();
  const {
    selectedItems,
    clearItems,
    sellItems,
    toggleSelling,
    selling,
  } = inventory;

  const clearHandler = () => {
    clearItems();
    toggleSelling();
  };

  return (
    <SellModal
      id={id}
      sellHandler={sellItems}
      closeHandler={toggleSelling}
      clearHandler={clearHandler}
      items={selectedItems}
      open={selling}
    />
  );
});
