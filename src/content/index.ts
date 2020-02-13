import { getOriginalWindow } from '../utils';
import { ControlsWrapper } from './ControlsWrapper';
import { OverlayWrapper } from './OverlayWrapper';
import { SellModalWrapper } from './SellModalWrapper';

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
