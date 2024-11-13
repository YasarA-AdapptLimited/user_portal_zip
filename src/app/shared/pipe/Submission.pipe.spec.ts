import { RevalidationItem } from '../../shared/model/revalidation/RevalidationItem';
import { SubmissionPipe } from "./Submission.pipe";

describe('StripHthmlPipe', () => {
    const pipe = new SubmissionPipe();

    it('returns empty array if no items provided', () => {
        expect(pipe.transform(null, true)).toEqual([]);
    });

    it('replaces <br/> with "" in a given string', () => {
        const items: RevalidationItem[] = [
            {
                id : '1',
                title : 'ABC',
                type: 0,
                dynamicFormId: 'ABC-1',
                total : 0,
                progress : 0,
                completed : false,
                invalid : false,
                isCompleted : false,
                included : true,
                deleted : false,
                submitted : false,
                submittedDate: '',
                answers: [],
                readonly : false
            },
            {
                id : '2',
                title : 'ABC',
                type: 0,
                dynamicFormId: 'ABC-2',
                total : 0,
                progress : 0,
                completed : false,
                invalid : false,
                isCompleted : false,
                included : false,
                deleted : false,
                submitted : false,
                submittedDate: '',
                answers: [],
                readonly : false
            }
        ];
        const results = [{
            id : '1',
            title : 'ABC',
            type: 0,
            dynamicFormId: 'ABC-1',
            total : 0,
            progress : 0,
            completed : false,
            invalid : false,
            isCompleted : false,
            included : true,
            deleted : false,
            submitted : false,
            submittedDate: '',
            answers: [],
            readonly : false
        }];
        expect(pipe.transform(items, true)).toEqual(results);
    });
});