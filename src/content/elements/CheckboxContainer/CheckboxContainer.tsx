import React from 'react';
import { observer } from 'mobx-react-lite';
import { useItem } from 'content/stores';
import { Checkbox } from '../';

export interface Props {
  id: string;
  itemId: string;
}

export const CheckboxContainer = observer(({ id, itemId }: Props) => {
  const { selected, setSelected } = useItem(itemId);

  return (
    <Checkbox id={id} checked={selected} onChange={() => setSelected(!selected)}/>
  );
});

export default CheckboxContainer;
