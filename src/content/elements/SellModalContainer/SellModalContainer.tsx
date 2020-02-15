import React, { useState, useEffect }  from 'react';
import { observer } from 'mobx-react';
import { SellModal } from '../';
import { useStores } from 'content/stores';
import { ICON_URL } from 'content/API';

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

  const [ derivativeItems, setDerivativeItems ] = useState([]);

  const makeHandlePriceChange = targetIndex => e => setDerivativeItems(
    derivativeItems.map((item: any, itemIndex) => itemIndex !== targetIndex ? item : { ...item, priceValue: e.target.value })
  );

  const [ priceModifier, setPriceModifier ] = useState('median');
  const handlePriceModifierChange = e => setPriceModifier(e.target.value);

  const [ percentageModifier, setPercentageModifier ] = useState('+0');
  const handlePercentageModifierChange = e => setPercentageModifier(e.target.value);

  console.log('render smc', derivativeItems);

  useEffect(() => {
    const newDerivativeItems = selectedItems.map((item: any) => {
      const { iconUrl, priceValue } = item;
      const width = '96f';
      const height = '96f';
      const src = `${ICON_URL}/${iconUrl}/${width}x${height}`;
    
      const percentageModifierNumber = Number.isNaN(parseFloat(percentageModifier)) ? 0 : parseFloat(percentageModifier);
      const price = parseFloat(priceValue);
      const verifiedPrice = Number.isNaN(price) ? 0 : price;
      const modifiedPrice = priceModifier === 'percentage'
        ? verifiedPrice + verifiedPrice * percentageModifierNumber / 100
        : verifiedPrice
      const renderedPrice = modifiedPrice > 0 ? modifiedPrice : 0;
      return {
        ...item,
        src,
        priceValue: renderedPrice,
      };
    });
    setDerivativeItems(newDerivativeItems);
  }, [ selectedItems, priceModifier, percentageModifier ]);

  return (
    <SellModal
      id={id}
      sellHandler={sellItems}
      closeHandler={toggleSelling}
      clearHandler={clearHandler}
      items={derivativeItems}
      open={selling}
      priceModifier={priceModifier}
      handlePriceModifierChange={handlePriceModifierChange}
      percentageModifier={percentageModifier}
      handlePercentageModifierChange={handlePercentageModifierChange}      
      makeHandlePriceChange={makeHandlePriceChange}
    />
  );
});
