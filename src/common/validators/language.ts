import { IsEnum } from 'class-validator';

export enum Language {
  ar = 'ar',
  en = 'en',
  fr = 'fr'
}

export class LanguageMiddlewareDto {
  constructor(lang: Language) {
    console.log('lang', lang);
    this.lang = lang;
  }
  @IsEnum(Language)
  lang: Language;
}
