/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly REACT_APP_JWT_SECRET: string;
  readonly REACT_APP_APP_NAME: string;
  readonly REACT_APP_CLIENT_ID: string;

}

interface ImportMeta {
  readonly env: ImportMetaEnv;
  readonly dirname: string;
}
