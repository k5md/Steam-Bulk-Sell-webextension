import React from 'react';
import { observer, useObserver } from 'mobx-react';
import { EXTENSION_NAME } from '../../constants';
import { useInventory, useLogger, storeContext, useStoreData } from 'content/stores';
import { Controls, Logger } from '../';

export const ControlsContainer = () => {
  const inventory = useInventory(storeContext);
  const logger = useLogger(storeContext);
  return useObserver(() => {
    

    return (
      <React.Fragment>
        <Logger id={`${EXTENSION_NAME}-Logger`} logs={logger.logs} />
        <Controls id={`${EXTENSION_NAME}-Controls`} sellHandler={() => inventory.setSelling(true)} />
      </React.Fragment>
    );
  })
};

export default ControlsContainer;
