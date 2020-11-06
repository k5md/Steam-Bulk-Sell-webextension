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
    offsetModifier,
    setPriceModifier,
    setMultiplyModifier,
    setOffsetModifier,
    total,
    applyPriceModifications,
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
    applyPriceModifications();
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
      offsetModifier={offsetModifier}
      setPriceModifier={(e): void => setPriceModifier(e.target.value)}
      setMultiplyModifier={(e): void => setMultiplyModifier(e.target.value)}
      setOffsetModifier={(e): void => setOffsetModifier(e.target.value)}
      total={total}
      fetchedItems={selected.every(item => item.priceFetched || item.error)}
    />
  );
});

export default SellModalContainer;
