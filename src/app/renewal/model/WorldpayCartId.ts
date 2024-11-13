export class WorldpayCartId {
  registrationNumber: string;
  renewalId: string;

  constructor(data) {
    Object.assign(this, data);
  }

  toString() {
    return JSON.stringify({
      registrationNumber: this.registrationNumber,
      renewalId: this.renewalId
    });
  }
}
