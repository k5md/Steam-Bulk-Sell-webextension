/** Global definitions for developement **/

// for style loader
declare module "*.scss" {
  const content: { [className: string]: string };
  export = content;
}

declare const PRODUCTION: boolean;
