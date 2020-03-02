import React, { useEffect, useCallback }  from 'react';
import { observer } from 'mobx-react-lite';
import { SellModal } from '../';
import { useInventory, useItems } from 'content/hooks';

export interface Props {
  id: string;
}

export const SellModalContainer: React.FC<Props> = observer(({ id }) => {
  const { toggleSellModal, showSellModal, sell } = useInventory();
  const { 
    selected,
    clear,
    multiplyModifier,
    priceModifier,
    setPriceModifier,
    setMultiplyModifier,
    total,
  } = useItems();

  const clearHandler = useCallback((): void => {
    clear();
    toggleSellModal();
  }, []);

  const sellHandler = useCallback((): void => {
    sell();
    toggleSellModal();
  }, []);

  useEffect(() => {
    document.body.style.overflowY = showSellModal ? 'hidden' : 'revert';
  }, [ showSellModal ]);

  return (
    <SellModal
      id={id}
      sellHandler={sellHandler}
      closeHandler={toggleSellModal}
      clearHandler={clearHandler}
      items={selected}
      open={showSellModal}
      multiplyModifier={multiplyModifier}
      priceModifier={priceModifier}
      setPriceModifier={(e): void => setPriceModifier(e.target.value)}
      setMultiplyModifier={(e): void => setMultiplyModifier(e.target.value)}
      total={total}
    />
  );
});

export default SellModalContainer;
