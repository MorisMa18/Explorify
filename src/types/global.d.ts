// JQueryStatic is a global ambient type from @types/jquery — no import needed.
declare global {
  interface Window {
    jQuery?: JQueryStatic;
    $?: JQueryStatic;
  }
}

export {};
