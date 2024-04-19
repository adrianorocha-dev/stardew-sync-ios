import en from 'src/translation/en.json';
import fr from 'src/translation/fr.json';

import { init18n } from '~/src/core/i18n/init';

export const resources = {
  en: {
    translation: en,
  },
  fr: {
    translation: fr,
  },
};

export const fallbackLng = 'en';

export type LanguageCode = keyof typeof resources;

const i18n = init18n({ resources, fallbackLng });

export default i18n;
