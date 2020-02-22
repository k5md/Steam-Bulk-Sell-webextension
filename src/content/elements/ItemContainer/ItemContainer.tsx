import React from 'react';
import { observer } from 'mobx-react';
import { useItem } from 'content/stores';
import { Checkbox } from '../';

export const ItemContainer = observer((id, itemId) => {
  const { selected, setSelected } = useItem(itemId);

  return (
    <Checkbox id={id} checked={selected} onChange={() => setSelected(!selected)}/>
  );
});

export default ItemContainer;
