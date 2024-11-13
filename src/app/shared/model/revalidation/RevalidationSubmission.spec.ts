import { RevalidationSubmission } from "./RevalidationSubmission";

describe('Revalidation Submission Model', () => {
    let testSubmission;    

    beforeEach(() => {
        testSubmission = new RevalidationSubmission();
    });

    it('should init correctly', () => {
        expect(testSubmission).toBeTruthy();
    });
});