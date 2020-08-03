// Configuration type
export interface nexmentConfigType {
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
