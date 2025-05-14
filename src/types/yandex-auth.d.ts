
// Type definitions for Yandex Auth SDK
declare global {
  interface Window {
    YaAuthSuggest?: {
      init: (
        oauthParams: {
          client_id: string;
          response_type: string;
          redirect_uri: string;
        },
        tokenPageOrigin: string,
        suggestParams?: {
          view: string;
          parentId: string;
          buttonView?: string;
          buttonTheme?: string;
          buttonSize?: string;
          buttonBorderRadius?: number;
        }
      ) => Promise<{
        status: string;
        handler: () => Promise<any>;
      }>;
    };
    
    YaSendSuggestToken?: (
      origin: string,
      params: {
        flag: boolean;
      }
    ) => void;
    
    handleYandexToken?: (token: string) => void;
  }
}

export {};
