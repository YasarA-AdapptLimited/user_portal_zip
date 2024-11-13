import { Component, Input, OnInit, ViewChild, ElementRef, AfterViewInit, forwardRef, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import { startWith, map } from 'rxjs/operators';
import { AccountService } from './service/account.service';
import { Applicant } from './model/Applicant';



@Component({
  selector: 'app-applicant',
  moduleId: module.id,
  templateUrl: './applicant.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ApplicantComponent),
      multi: true
    }
  ]
})
export class ApplicantComponent implements OnInit, ControlValueAccessor {

  @Input() isStudent = false;
  @Input() isTechnician = false;
  @Input() isAssessmentReport = false;
  @Input() isAssessmentRegistration = false;
  applicant: Applicant;
  salutations: Array<{ key: string; value: number }> = [];
  @ViewChild('salutationInput') salutationRef: ElementRef;
  salutation: FormControl<string | null> = new FormControl();
  filteredSalutations: Observable<any[]>;
  @Input() readonly = false;
  @Input() touched = false;
  nationalities = [];
  zero = 0;

  constructor(private service: AccountService) { }

  ngOnInit() {

    this.loadSalutations();
    this.loadNationalities();

  }

  get noNationality() {
    return !parseInt(<any>(this.applicant.equalityDiversity.nationality), 10);
  }

  loadSalutations() {
    this.service.getSalutations().subscribe(data => {
      for (const key in data) {
        this.salutations.push({ key, value: data[key] });
      }
      this.filteredSalutations = this.salutation.valueChanges
        .pipe(
          startWith(''),
          map(val => this.filter(val))
        );

      this.salutation.valueChanges.subscribe(value => {
        if (!value) {
          return false;
        } else {
          const selected = this.salutations.filter(item => item.key.toLowerCase() === value.toLowerCase());

          let newValue = { name: value, id: 981360000 };
          if (selected.length) {
            newValue = { name: selected[0].key, id: selected[0].value };
          }
          if (newValue.name !== this.applicant.title.name) {
            this.applicant.title = newValue;
            this.propagateChange(this.applicant);
          }
        }
      });
    });

  }

  loadNationalities() {
    this.service.getEdiOptions().subscribe(data => {
      this.nationalities = data.sections.find(section => section.name === 'Nationality').groups;
    });
  }


  writeValue(value: Applicant) {

    if (value) {
      this.applicant = value;
      this.applicant.equalityDiversity = this.applicant.equalityDiversity || {
        ethnicity: undefined,
        ethnicityOther: '',
        nationality: 0,
        religion: undefined,
        religionOther: '',
        disabled: undefined,
        disabilityDetails: '',
        gender: undefined,
        sexualOrientation: undefined
      };
      if (value.title) {
        this.salutation.setValue(value.title.name);
      }
    }
  }

  propagateChange = (model: any) => { };

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched() { }

  filter(val: string): { key: string; value: number }[] {
    return this.salutations.filter(option =>
      option.key.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }

}
