/// <reference types="next" />
/// <reference types="next/types/global" />

// for css modules
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}
