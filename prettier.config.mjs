/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
  plugins: [
    'prettier-plugin-tailwindcss',
    '@trivago/prettier-plugin-sort-imports',
  ],
  importOrderParserPlugins: [
    'typescript',
    'jsx',
    'decorators-legacy',
    'explicitResourceManagement',
  ],
  singleQuote: true,
  importOrder: [
    '<THIRD_PARTY_MODULES>',
    '^@/[a-z]',
    '^[./]',
    '.svg',
    '.s?css$',
    '.json$',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: false,
};

export default config;
