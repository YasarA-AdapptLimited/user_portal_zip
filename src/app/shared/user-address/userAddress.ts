import { Address } from '../../account/model/Address';

export enum HomeNationTypes {
    England = 717750000,
    Wales = 717750001,
    Scotland = 717750002,
    Other = 717750003,
}

export const  CountriesOfUK = [
    {country: 'England', homeNation: HomeNationTypes.England},
    {country: 'Wales', homeNation: HomeNationTypes.Wales},
    {country: 'Scotland', homeNation: HomeNationTypes.Scotland},
    {country: 'Other', homeNation: HomeNationTypes.Other}
] as const;

export const UK = 'United Kingdom' as const;

export const patternToTestLatinAlphabets = new RegExp('^[\x00-\x7F]*$');

export function getCountryName(homeNation) {
    switch(Number(homeNation)){
        case HomeNationTypes.England:
        return CountriesOfUK[0].country;
        case HomeNationTypes.Wales:
        return CountriesOfUK[1].country;
        case HomeNationTypes.Scotland:
        return CountriesOfUK[2].country;
        case HomeNationTypes.Other:
        return CountriesOfUK[3].country;
        default:
        return '';
      }
}

export function inputValidator(val): boolean {
    const pattern = patternToTestLatinAlphabets;
    return pattern.test(val) ?  true : false;
}