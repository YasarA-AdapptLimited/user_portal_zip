import { TestBed, inject } from '@angular/core/testing';
import { SupportingDocumentsService } from './supportingDocuments.service';

describe('SupportingDocuments Service', () => {
  let testService: SupportingDocumentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SupportingDocumentsService]
    });
    testService = TestBed.inject(SupportingDocumentsService);
  });

  it('clear validators', () => {
    testService.clear();
    expect(testService.validators).toEqual([]);
  });

  it('add attachment',() => {
    testService.validators = [{type: 1, validate: () => ['proof']}];    
    testService.add(2,() => ['certificate'] );
    expect(testService.validators.length).toBe(2);
  });

  it('validate',() => {
    testService.validators = [{type: 1, validate: () => ['proof']}];    
    expect(testService.validate()).toEqual(['proof']);
  });
});
