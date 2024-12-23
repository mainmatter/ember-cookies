declare module 'test-app/config/environment' {
  type Config = {
    modulePrefix: string;
    APP: Record<string, string>;
    locationType: string;
    rootURL: string;
  };

  export default {} as Config;
}
