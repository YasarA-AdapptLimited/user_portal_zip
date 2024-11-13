import { ftpDeclarationObj } from "./FtPDeclaration";

describe(' FtP object', () => {
    let testFtP;

    beforeEach(() => {
        testFtP = new ftpDeclarationObj('Q10');
    });

    it('should init correctly', () => {
        expect(testFtP).toBeTruthy();
    });

    it('employerAddress and other fields set as null on call of setValuesIfNotRegistered', () => {
        testFtP.setValuesIfNotRegistered();
        expect(testFtP.employerAddress).toBe(null);
    });

    it('case reference number set as null on call of setValuesIfNotInvestigated', () => {
        testFtP.setValuesIfNotInvestigated();
        expect(testFtP.caseReferenceNo).toBeNull();
    });

    it('howWhereUsedIt is set as null on call of setValuesIfInvestigated', () => {
        testFtP.setValuesIfInvestigated();
        expect(testFtP.howWhereUsedIt).toBeNull();
    });

})