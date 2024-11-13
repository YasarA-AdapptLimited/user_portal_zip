import { ReviewSummaryItem } from "./ReviewSummaryItem";


describe('Review Summary Item Model', () => {
    let testSummaryItem;

    beforeEach(() => {
        testSummaryItem = new ReviewSummaryItem();
    });

    it('should init correctly', () => {
        expect(testSummaryItem).toBeTruthy();
    });

    it('should method getTotal return 100', () => {
        expect(testSummaryItem.getTotal()).toBe(100);
    }); 

    it('should method getIsCompleted return false', () => {
        expect(testSummaryItem.getIsCompleted()).toBe(false);
    }); 

    it('should method getProgress be equal to progressPercentage', () => {
        expect(testSummaryItem.getProgress()).toBe(testSummaryItem.progressPercentage);
    })
});