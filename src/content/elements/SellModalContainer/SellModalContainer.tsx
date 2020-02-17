import React, { useState, useEffect }  from 'react';
import { observer } from 'mobx-react';
import { SellModal } from '../';
import { useInventory } from 'content/stores';
import { getIconUrl } from 'content/API';

export const SellModalContainer = observer(({ id }) => {
  const {
    selected,
    clear,
    sell,
    toggleSelling,
    selling,
  } = useInventory();

  const clearHandler = () => {
    clear();
    toggleSelling();
  };

  useEffect(() => {
    document.body.style.overflowY = selling ? 'hidden' : 'revert';
  }, [ selling ])

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
    const newDerivativeItems = selected.map((item: any) => {
      const { iconUrl, priceValue } = item;
      const src = getIconUrl(iconUrl);
    
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
  }, [ selected, priceModifier, percentageModifier ]);

  return (
    <SellModal
      id={id}
      sellHandler={sell}
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
