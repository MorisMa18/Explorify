// react-owl-carousel ships its own types (umd/OwlCarousel.d.ts) — no ambient
// module declaration needed for it, and @types/jquery already declares
// JQueryStatic's camelCase/type/isFunction/isArray/isWindow/trim members, so
// no augmentation is needed for those either. The one gap: `jquery/dist/jquery.js`
// is a subpath import @types/jquery doesn't cover (it only maps the bare
// "jquery" specifier).
declare module "jquery/dist/jquery.js" {
  const jQuery: JQueryStatic;
  export default jQuery;
}
