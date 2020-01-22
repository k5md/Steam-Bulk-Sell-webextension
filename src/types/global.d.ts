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
}

declare const PRODUCTION: boolean;
