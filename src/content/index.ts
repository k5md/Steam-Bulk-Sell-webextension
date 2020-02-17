import { ControlsWrapper } from './ControlsWrapper';
import { OverlayWrapper } from './OverlayWrapper';
import { SellModalWrapper } from './SellModalWrapper';
import { getOriginalWindow } from '../utils';
import { EXTENSION_NAME } from './constants';

class SteamBulkSell {
  constructor(
    public overlay: OverlayWrapper = null,
    public controls: ControlsWrapper = null,
    public sellModal: SellModalWrapper = null,
  ) {}

   async init(): Promise<void> {
    const { g_bMarketAllowed: marketAllowed } = getOriginalWindow(window);

    if (!marketAllowed) {
      return;
    }

    const stales = document.querySelectorAll(`[id^=${EXTENSION_NAME}`);
    stales.forEach(element => element.parentElement.removeChild(element));

    this.overlay = new OverlayWrapper();
    this.overlay.init();

    this.controls = new ControlsWrapper();
    this.controls.init();

    this.sellModal = new SellModalWrapper();
    this.sellModal.init();
  }
}

const instance = new SteamBulkSell();
instance.init();
