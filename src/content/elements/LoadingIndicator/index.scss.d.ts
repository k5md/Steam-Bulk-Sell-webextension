declare namespace IndexScssModule {
  export interface IIndexScss {
    indicator_container: string;
    indicator_progress: string;
    indicator_text: string;
  }
}

declare const IndexScssModule: IndexScssModule.IIndexScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: IndexScssModule.IIndexScss;
};

export = IndexScssModule;
