import { ControlsWrapper } from './ControlsWrapper';
import { OverlayWrapper } from './OverlayWrapper';
import { SellModalWrapper } from './SellModalWrapper';
import { getOriginalWindow } from '../utils';
import { EXTENSION_NAME } from './constants';

class SteamBulkSell {
  constructor(
    public overlay: OverlayWrapper =  new OverlayWrapper(),
    public controls: ControlsWrapper = new ControlsWrapper(),
    public sellModal: SellModalWrapper = new SellModalWrapper(),
  ) {}

   async init(): Promise<void> {
    const { g_bMarketAllowed: marketAllowed } = getOriginalWindow(window);

    if (!marketAllowed) {
      return;
    }

    const stales = document.querySelectorAll(`[id^=${EXTENSION_NAME}`);
    stales.forEach(element => element.parentElement.removeChild(element));

    this.overlay.init();
    this.controls.init();
    this.sellModal.init();
  }
}

const instance = new SteamBulkSell();
instance.init();
