import { Review } from "./Review";

describe('Review Model', () => {
    let testReview;
    let testReviewData = {
        id: '123',
        submissionDate: '12-20-2020',
        reviewerConfirmation: 1,
        stage: 8,
        title: 'test',
        isFeedbackEditable: true,
        isLeadReviewer: true,
        messages: [],
        entries: [],
        feedback: {
            performanceIndicator: 1,
            peerDiscussionFeedback: 'text',
            plannedCpdFeedback: 'text',
            unplannedCpdFeedback: 'text',
            reflectiveAccountFeedback:'text',
        },
        feedbacks:[],
        currentReviewerAssessment: 1,
        otherReviewerAssessment: 1,
        registrantType: 1,
    }

    beforeEach(() => {
        testReview = new Review(testReviewData);
    });

    it('should init correctly', () => {
        expect(testReview).toBeTruthy();
    });

    it('should method isCoreCriteriaFeedbackRequired return false', () => {
        expect(testReview.isCoreCriteriaFeedbackRequired()).toBe(false);
    }); 

    it('should method getIsCompleted return false', () => {
        expect(testReview.getIsCompleted()).toBe(false);
    }); 

    it('should method getTotal return 1 if Review stage is annotate', () => {
        testReview.stage = 1;
        expect(testReview.getTotal()).toBe(1);
    });

    it('should method getTotal return 5 if leadReviewer is true', () => {
        testReview.stage = 3;
        expect(testReview.getTotal()).toBe(5);
    });

    it('method getProgress returns 0 if Review stage is annotate', () => {
        testReview.stage = 1;
        testReview.currentReviewerAssessment = 1;
        expect(testReview.getProgress()).toBe(1);
    });

    it('method getProgress returns 0 if Review stage is 3 and no leadReviewer', () => {
        testReview.stage = 3;
        testReview.isLeadReviewer = false;
        expect(testReview.getProgress()).toBe(0);
    });

    it('method getProgress returns 0 if Review stage is 3 and no leadReviewer', () => {
        testReview.stage = 3;
        testReview.isLeadReviewer = false;
        expect(testReview.getProgress()).toBe(0);
    });

    it('method getProgress returns count 0 if conditions are not satisfied', () => {
        expect(testReview.getProgress()).toBe(0);
    });

    it('method getProgress returns count based on feedback provided', () => {
        testReview.stage = 3;
        testReview.isLeadReviewer = true;
        testReview.feedback = {
            performanceIndicator: 1,
            peerDiscussionFeedback: 'text',
            plannedCpdFeedback: 'text',
            unplannedCpdFeedback: 'text',
            reflectiveAccountFeedback:'text',
        };
    
        expect(testReview.getProgress()).toBe(5);
    });
});