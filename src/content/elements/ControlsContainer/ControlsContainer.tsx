import React from 'react';
import { observer } from 'mobx-react-lite';
import { EXTENSION_NAME } from '../../constants';
import { useLogger, useInventory } from 'content/stores';
import { Controls, Logger } from '../';

export const ControlsContainer = observer(() => {
  const { logs } = useLogger();
  const { toggleSelling } = useInventory();

  return (
    <React.Fragment>
      <Logger id={`${EXTENSION_NAME}-Logger`}>
        {logs}
      </Logger>
      <Controls id={`${EXTENSION_NAME}-Controls`} sellHandler={toggleSelling} />
    </React.Fragment>
  );
});

export default ControlsContainer;
