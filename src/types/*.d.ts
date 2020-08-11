declare module "*.vue" {
  import Vue from "vue";
  export default Vue;
}
declare module "vue-content-loader";
interface nexmentConfigType {
  pageKey?: string;
  enableLinkInput?: boolean;
  leancloud: {
    appId: string;
    appKey: string;
    serverURL: string;
  };
  admin: {
    name: string;
    email: string;
  };
}
