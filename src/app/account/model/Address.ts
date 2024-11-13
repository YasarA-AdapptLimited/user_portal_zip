import { IAddress } from './IAddress';

export class Address implements IAddress {
  line1: string;
  line2: string;
  line3: string;
  town: string;
  county: string;
  postcode: string;
  country: string;
  resident?: string;
  homeNation?:number;
  latitude?:string;
  longitude?:string;
  countryCode?: string;
  id?:string;
  
  constructor(data?: any) {
    Object.assign(this, data);
  }

  private concat(item: string, delimiter) {
    return item ? item + delimiter : '';
  }

  toString(delimiter = ', ') {
    return this.concat(this.line1, delimiter) +
    this.concat(this.line2, delimiter) +
    this.concat(this.line3, delimiter) +
    this.concat(this.town, delimiter) +
    this.concat(this.county, delimiter) +
    this.concat(this.country, delimiter) +
    this.postcode;

  }
}


