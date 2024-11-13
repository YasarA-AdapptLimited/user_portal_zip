import { RevalidationItemTypePipe } from "./ItemTypeFilter.pipe";
import { RevalidationItem } from '../../shared/model/revalidation/RevalidationItem';

describe('ItemTypeFilterPipe', () => {
    const pipe = new RevalidationItemTypePipe();

    it('returns empty array if no items found', () => {
        expect(pipe.transform(null,0)).toEqual([]);
    });

    it('returns array of items matching type', () => {
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
                included : true,
                deleted : false,
                submitted : false,
                submittedDate: '',
                answers: [],
                readonly : false
            }
        ];
        expect(pipe.transform(items,0)).toEqual(items);
    });
});