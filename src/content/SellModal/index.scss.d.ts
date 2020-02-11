declare namespace IndexScssModule {
  export interface IIndexScss {
    modal_items__empty: string;
    modal_items__entry: string;
    modal_items__entry_ellipsized: string;
    modal_items__entry_flex: string;
    modal_items__entry_inline_flex: string;
    modal_items__total: string;
    modal_sell__buttons: string;
    modal_sell__controls: string;
    modal_sell__divider: string;
    modal_sell__items: string;
    modal_sell__percentage_number: string;
    modal_sell__price_modifier: string;
  }
}

declare const IndexScssModule: IndexScssModule.IIndexScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: IndexScssModule.IIndexScss;
};

export = IndexScssModule;
