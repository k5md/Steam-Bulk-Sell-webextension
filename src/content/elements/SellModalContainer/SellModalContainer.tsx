import React from 'react';
import { observer } from 'mobx-react';
import { SellModal } from '../';
import { useInventory, storeContext } from 'content/stores';

export const SellModalContainer = observer(({ id }) => {
  const inventory = useInventory(storeContext);
  const {
    selectedItems,
    clearItems,
    sellItems,
    setSelling,
    selling,
  } = inventory;

  console.log('in smc', inventory);

  return (
    <SellModal
      id={id}
      sellHandler={sellItems}
      closeHandler={() => setSelling(false)}
      clearHandler={clearItems}
      items={selectedItems}
      open={selling}
    />
  );
});
