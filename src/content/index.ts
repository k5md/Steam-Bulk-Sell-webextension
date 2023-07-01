import { ControlsWrapper, OverlayWrapper, SellModalWrapper } from './wrappers';
import { getOriginalWindow } from '../utils';
import { EXTENSION_NAME } from './constants';

class SteamBulkSell {
  constructor(
    public overlay: OverlayWrapper =  new OverlayWrapper(),
    public controls: ControlsWrapper = new ControlsWrapper(),
    public sellModal: SellModalWrapper = new SellModalWrapper(),
  ) {}

   async init(): Promise<void> {
    const originalWindow =  getOriginalWindow(window);
    const marketAllowed = 'g_bMarketAllowed' in originalWindow && originalWindow.g_bMarketAllowed

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
