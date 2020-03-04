import React from 'react';
import { observer } from 'mobx-react-lite';
import { useLogger, useInventory } from 'content/hooks';
import { Controls, Logger } from '../';

export interface Props {
  id: string;
  toggleVisible: () => void;
}

export const ControlsContainer: React.FC<Props> = observer(({ id, toggleVisible }) => {
  const { logs } = useLogger();
  const { toggleSellModal } = useInventory();

  return (
    <div id={id}>
      <Logger>{logs}</Logger>
      <Controls sellHandler={toggleSellModal} toggleVisible={toggleVisible} />
    </div>
  );
});

export default ControlsContainer;
