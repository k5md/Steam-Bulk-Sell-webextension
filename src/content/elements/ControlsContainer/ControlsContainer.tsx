import React from 'react';
import { observer } from 'mobx-react-lite';
import { useLogger, useInventory } from 'content/hooks';
import { Controls, Logger } from '../';

export interface Props {
  toggleVisible: () => void;
  id?: string;
}

export const ControlsContainer: React.FC<Props> = observer(({ id, toggleVisible }) => {
  const { logs } = useLogger();
  const { toggleSellModal, selling } = useInventory();

  return (
    <div id={id}>
      <Logger>{logs}</Logger>
      <Controls sellHandler={toggleSellModal} toggleVisible={toggleVisible} selling={selling} />
    </div>
  );
});

export default ControlsContainer;
