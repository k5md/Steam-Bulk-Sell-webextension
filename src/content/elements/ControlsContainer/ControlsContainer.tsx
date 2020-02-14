import React from 'react';
import { observer } from 'mobx-react';
import { EXTENSION_NAME } from '../../constants';
import { useStores } from 'content/stores';
import { Controls, Logger } from '../';

export const ControlsContainer = observer(() => {
  const { inventory: { toggleSelling }, logger: { logs } } = useStores();

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
