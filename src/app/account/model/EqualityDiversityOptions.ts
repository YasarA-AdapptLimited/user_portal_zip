
interface Option {
  isOther: boolean;
  id: number;
  name: string;
}
interface OptionGroup {
  group: string;
  orderId: number;
  subGroups: Array<Option>;
}
interface OptionSection {
  name: string;
  groups: Array<Option>;
}
export interface EqualityDiversityOptions {
  ethnicity: Array<OptionGroup>;
  sections: Array<OptionSection>;
}
