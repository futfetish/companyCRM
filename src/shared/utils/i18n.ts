export const i18n = (i18n : Record<string , Record<string , string>> ,key: string, locale: string) => {
    // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
    if (i18n[key] && i18n[key][locale]) {
        return i18n[key][locale]; 
    }

    return key; 
  };
  