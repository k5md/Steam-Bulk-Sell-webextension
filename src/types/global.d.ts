/** Global definitions for developement **/

// for style loader
declare module "*.scss" {
  const content: { [className: string]: string };
  export = content;
}

// for steam content script
export {}
declare global {
  interface Window {
    wrappedJSObject: any;
  }
  let XPCNativeWrapper: any;
  let browser: any;
}

declare namespace JSX {
  interface IntrinsicElements {
      [elemName: string]: any;
  }
}

declare const PRODUCTION: boolean;
