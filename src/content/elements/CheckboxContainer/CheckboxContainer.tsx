import React, { useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { useItem } from 'content/hooks';
import { Checkbox } from '../';

export interface Props {
  id?: string;
  itemId: string;
}

export const CheckboxContainer: React.FC<Props> = observer(({ id, itemId }) => {
  const { selected, setSelected } = useItem(itemId);
  const onChange = useCallback(e => setSelected(e.target.checked), []);

  return (
    <Checkbox id={id} checked={selected} onChange={onChange}/>
  );
});

export default CheckboxContainer;
