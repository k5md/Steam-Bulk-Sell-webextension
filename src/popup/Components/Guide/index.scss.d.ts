declare namespace IndexScssModule {
  export interface IIndexScss {
    guide__run_button: string;
    guide__run_issues: string;
    guide__run_links: string;
  }
}

declare const IndexScssModule: IndexScssModule.IIndexScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: IndexScssModule.IIndexScss;
};

export = IndexScssModule;
