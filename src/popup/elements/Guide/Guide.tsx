import React from 'react';
import styles from './index.scss';

export const Guide: React.FC = () => (
  <div>
    <div>
      <p>{browser.i18n.getMessage('guide_purpose')}</p>
    </div>
    <div>
      {browser.i18n.getMessage('guide_run_0')}
      <div className={styles.guide__run_links}>
        <a href={browser.i18n.getMessage('guide_run_link_my')}>
          {browser.i18n.getMessage('guide_run_link_profile')}
        </a>
      </div>
      <p>{browser.i18n.getMessage('guide_run_1')}</p>
    </div>
    <div className={styles.guide__run_issues}>
      <p>
        {browser.i18n.getMessage('guide_issues_information')}
        <span> </span>
        <a href="https://github.com/k5md/Steam-Bulk-Sell-webextension/issues/new">
          {browser.i18n.getMessage('guide_issues_link')}
        </a>
      </p>
    </div>

  </div>

);

export default Guide;
