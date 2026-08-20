// Side-effect-only CSS imports (import "./Foo.css";) have no exports — Next's
// webpack config handles the actual bundling, this just gives TypeScript a
// module to resolve against so it doesn't flag them under
// noUncheckedSideEffectImports.
declare module "*.css";
