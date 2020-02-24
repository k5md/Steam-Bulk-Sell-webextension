import React, { useEffect }  from 'react';
import { observer } from 'mobx-react';
import { SellModal } from '../';
import { useInventory, useItems } from 'content/stores';

export const SellModalContainer = observer(({ id }) => {
  const { toggleSelling, selling } = useInventory();
  const { 
    selected,
    clear,
    sell,
    multiplyModifier,
    priceModifier,
    setPriceModifier,
    setMultiplyModifier,
    total,
  } = useItems();

  const clearHandler = () => {
    clear();
    toggleSelling();
  };

  useEffect(() => {
    document.body.style.overflowY = selling ? 'hidden' : 'revert';
  }, [ selling ])

  return (
    <SellModal
      id={id}
      sellHandler={sell}
      closeHandler={toggleSelling}
      clearHandler={clearHandler}
      items={selected}
      open={selling}
      multiplyModifier={multiplyModifier}
      priceModifier={priceModifier}
      setPriceModifier={(e) => setPriceModifier(e.target.value)}
      setMultiplyModifier={(e) => setMultiplyModifier(e.target.value)}
      total={total}
    />
  );
});

export default SellModalContainer;
