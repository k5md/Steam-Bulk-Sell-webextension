/** Global definitions for developement **/

export {}
declare global {
  interface Window {
    wrappedJSObject: any;
  }
  let XPCNativeWrapper: any;
  let browser: any;
  const PRODUCTION: boolean;
}

declare module "*.scss" {
  const content: { [className: string]: string };
  export = content;
}