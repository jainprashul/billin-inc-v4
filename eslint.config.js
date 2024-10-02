import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import PluginReactHook from "eslint-plugin-react-hooks";



export default [
  {files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"]},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    plugins: {
      "react-hooks": PluginReactHook,
    }
  },

  // Add your own rules here
  {
    rules : {
      'react/react-in-jsx-scope': 'off',
      'react/display-name': 'off',
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "off",
      "prefer-const": "warn",
      '@typescript-eslint/no-empty-object-type': 'off',


    }
  }
];