
import { } from 'jasmine';
import { FormValidationService } from './formValidationService';
import { Form } from '../model/Form';
const mockForm1 = require('./mock/form1.mock.json');
const mockForm2 = require('./mock/form2.mock.json');


xdescribe('Service: FormService', () => {

  let service: FormValidationService;

  beforeEach(() => {
    service = new FormValidationService();
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  it('should be able to add form data', () => {
    service.addForm(mockForm1);
    expect(service.forms.length).toBeGreaterThan(0);
    const form: Form = service.getForm('1');
    expect(form.completed).toBeFalsy();
    expect(form.formBody).toEqual(mockForm1.formBody);
  });

  it('should be able answer questions', () => {
    service.addForm(mockForm1);
    service.setAnswer('1', '7', 'Chocolate');
    const form: Form = service.getForm('1');
    expect(form.completed).toBeFalsy();
    expect(form.progress).toBe(1);
  });

  it('should require questions marked as required', () => {
    service.addForm(mockForm1);
    service.setAnswer('1', '7', 'Chocolate');
    service.setAnswer('1', '1', 'Red'); // has required alternatives
    const form: Form = service.getForm('1');
    expect(form.progress).toBe(1);
    expect(form.completed).toBeFalsy();
  });

  it('should be completed when all required questions are answered', () => {
    service.addForm(mockForm1);
    service.setAnswer('1', '7', 'Chocolate');
    service.setAnswer('1', '1', 'Red'); // has required alternatives
    service.setAnswer('1', '3', 'vampire');
    const form: Form = service.getForm('1');
    expect(form.progress).toBe(2);
    expect(form.completed).toBeTruthy();
  });

  it('should force the required alternative to be selected', () => {
    service.addForm(mockForm1);
    service.setAnswer('1', '7', 'Chocolate');
    service.setAnswer('1', '1', 'Red'); // has required alternatives
    service.setAnswer('1', '3', 'energy');
    const form: Form = service.getForm('1');
    expect(form.progress).toBe(2);
    expect(form.completed).toBeFalsy();
  });

  it('should recognise that an email is invalid', () => {
    service.addForm(mockForm2);
    service.setAnswer(mockForm2.dynamicFormId, '1', 'not@validemailaddress');
    const form: Form = service.getForm(mockForm2.dynamicFormId);
    expect(form.progress).toBe(0);
    expect(form.completed).toBeFalsy();
  });

  it('should recognise that an email is valid', () => {
    service.addForm(mockForm2);
    service.setAnswer(mockForm2.dynamicFormId, '1', 'john@website.com');
    const form: Form = service.getForm(mockForm2.dynamicFormId);
    expect(form.progress).toBe(1);
    expect(form.completed).toBeTruthy();
  });

});

