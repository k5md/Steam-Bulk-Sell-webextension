import React from 'react';
import { observer } from 'mobx-react-lite';
import { useLogger, useInventory } from 'content/hooks';
import { Controls, Logger } from '../';

export interface Props {
  id: string;
}

export const ControlsContainer: React.FC<Props> = observer(({ id }) => {
  const { logs } = useLogger();
  const { toggleSelling } = useInventory();

  return (
    <div id={id}>
      <Logger>{logs}</Logger>
      <Controls sellHandler={toggleSelling} />
    </div>
  );
});

export default ControlsContainer;
