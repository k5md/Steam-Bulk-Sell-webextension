import React from 'react';

import styles from './index.scss';

export const Guide = () => (
  <div>
    <div className={styles.guide__purpose}>
      <p>{browser.i18n.getMessage('guide_purpose')}</p>
    </div>
    <div className={styles.guide__run}>
      <p>{browser.i18n.getMessage('guide_run_0')}</p>
      <div className={styles.guide__run_links}>
        <p>{browser.i18n.getMessage('guide_run_link_profile')}</p>
        <p>{browser.i18n.getMessage('guide_run_link_id')}</p>
      </div>
      <div className={styles.guide__run_buttons}>
        <div>
          <p>{browser.i18n.getMessage('guide_run_1')}</p>
        </div>
        <input
          type="button"
          className={styles.guide__run_button}
          value={browser.i18n.getMessage('controls_button_sell')}
        />
      </div>
      <p>{browser.i18n.getMessage('guide_run_2')}</p>
    </div>
    <div className={styles.guide__run_issues}>
      <p>{browser.i18n.getMessage('guide_issues_information')}</p>
      <a href="https://github.com/k5md/Steam-Bulk-Sell-webextension/issues/new">
        {browser.i18n.getMessage('guide_issues_link')}
      </a>
    </div>

  </div>

);

export default Guide;
