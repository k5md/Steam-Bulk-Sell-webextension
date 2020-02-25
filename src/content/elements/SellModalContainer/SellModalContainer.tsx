import React, { useEffect }  from 'react';
import { observer } from 'mobx-react-lite';
import { SellModal } from '../';
import { useInventory, useItems } from 'content/hooks';

export interface Props {
  id: string;
}

export const SellModalContainer: React.FC<Props> = observer(({ id }) => {
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

  const clearHandler = (): void => {
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
      setPriceModifier={(e): void => setPriceModifier(e.target.value)}
      setMultiplyModifier={(e): void => setMultiplyModifier(e.target.value)}
      total={total}
    />
  );
});

export default SellModalContainer;
