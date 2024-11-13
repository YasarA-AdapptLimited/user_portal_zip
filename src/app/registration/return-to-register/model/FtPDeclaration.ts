import { Address } from "../../../account/model/Address";

interface ftpDeclarationType {
    questionName: string,
    isRegistered: boolean,
    isInvestigated: boolean,
    caseReferenceNo: string,
    investigationDate: string,
    titleUsed: string,
    employerName: string,
    howWhereUsedIt: string,
    titleUsedFrom: string,
    titleUsedUntil: string,
    employerAddress: Address
}

export class ftpDeclarationObj implements ftpDeclarationType {
questionName = null;
isRegistered = null;
isInvestigated = null;
caseReferenceNo = null;
investigationDate = null;
titleUsed = null;
employerName = null;
howWhereUsedIt = null;
titleUsedFrom = null;
titleUsedUntil = null;
employerAddress = null;

constructor(name: string) {
  this.questionName = name;
}

setValuesIfNotRegistered(): void {  
  this.isInvestigated = null;
  this.caseReferenceNo = null;
  this.investigationDate = null;
  this.titleUsed = null;
  this.employerName = null;
  this.howWhereUsedIt = null;
  this.titleUsedFrom = null;
  this.titleUsedUntil = null;
  this.employerAddress = null;
}

setValuesIfInvestigated() : void{
  this.titleUsed = null;
  this.employerName = null;
  this.titleUsedFrom = null;
  this.titleUsedUntil = null;
  this.employerAddress = null;
  this.howWhereUsedIt = null;
}

setValuesIfNotInvestigated() : void{
  this.caseReferenceNo = null;
  this.investigationDate = null;
}
}