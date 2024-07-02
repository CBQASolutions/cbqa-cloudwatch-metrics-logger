export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      AWS_REGION: string;
      AWS_ACCESS_KEY_ID: string;
      AWS_SECRET_ACCESS_KEY: string;
    }
  }
}
