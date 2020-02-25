/** Global definitions for developement **/

declare module "*.scss" {
  const content: { [className: string]: string };
  export = content;
}

export {}
declare global {
  const PRODUCTION: boolean;
  interface Window {
    wrappedJSObject: any;
  }
  let XPCNativeWrapper: any;
  let browser: any;
}