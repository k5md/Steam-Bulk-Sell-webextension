interface SteamBulkSell {
  logContainer: HTMLElement;
}


class SteamBulkSell {
  constructor() {
    // initialize logging
    const log = document.createElement('div');
    const logStyle = {
      'margin-left': '241px',
      'height': '69px',
      'top': '-73px',
      'position': 'relative',
      'overflow-y': 'scroll',
      'word-wrap': 'anywhere',
    };
    Object.entries(logStyle).forEach(([property, value]) => log.style[property] = value);
    this.logContainer = log;
  }

  mount(): void {
    // mount logging
    const logWrapper = document.getElementById('inventory_logos');
    logWrapper.appendChild(this.logContainer);

    // watch container and mount checkboxes
    const mountCheckboxes = (container: Element): void => {
      const items = container.getElementsByClassName('itemHolder');
      Array.from(items)
        .filter((item: HTMLElement) => 
          item.hasChildNodes()
          && item.style.display !== 'none'
          && !item.classList.contains('disabled')
          && !item.getElementsByTagName('input').length
        )
        .forEach((item: HTMLElement) => {
          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.checked = false;
          checkbox.style.position = 'absolute';
          checkbox.style.top = '0px';
          checkbox.style.zIndex = '9000';
          item.appendChild(checkbox);
        });
    }

    const inventories = document.getElementById('inventories');
    const inventory = inventories.children[0];

    mountCheckboxes(inventory);
    const observer = new MutationObserver(() => {
      mountCheckboxes(inventory);
    });
    observer.observe(inventory, { childList: true });
  }

  log(message, tag = 'Main'): void {
    const entry = document.createElement('div');
    entry.innerHTML = `[${tag}]: ${message}`
    this.logContainer.appendChild(entry);
  }
}

const instance = new SteamBulkSell();
instance.mount();
instance.log('SteamBulkSell is now running');


