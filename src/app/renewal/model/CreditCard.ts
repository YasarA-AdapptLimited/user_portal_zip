export interface CreditCard {
  id: string;
  name: string;
}
export const creditCards: Array<CreditCard> = [
  {
    id: 'MSCD',
    name: 'MasterCard'
  },
  {
    id: 'DMC',
    name: 'MasterCard Debit'
  },
  {
    id: 'VISA',
    name: 'Visa Credit'
  },
  {
    id: 'VISD',
    name: 'Visa Debit'
  },
  {
    id: 'VIED',
    name: 'Visa Electron'
  },
  {
    id: 'MAES',
    name: 'Maestro'
  },
  {
    id: 'JCB',
    name: 'JCB'
  }
];
