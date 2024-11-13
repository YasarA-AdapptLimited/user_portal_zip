import { Injectable } from '@angular/core';
import { EqualityDiversityOptions } from '../model/EqualityDiversityOptions';
import { EqualityDiversity } from '../model/EqualityDiversity';
import { AccountService } from './account.service';
import { BehaviorSubject } from 'rxjs';
import { StepValidity } from '../../shared/formStepper/StepValidity';
import { of as observableOf, from as observableFrom } from 'rxjs';
import { map, tap } from 'rxjs/operators';

// Pascal cased props due to section names returned from the server
interface EdiValidity {
  Gender: boolean;
  Ethnicity: boolean;
  Religion: boolean;
  Disability: boolean;
//  Nationality: boolean;
  SexualOrientation: boolean;
}

@Injectable() export class EdiService {

  options$ = new BehaviorSubject<EqualityDiversityOptions>(null);
  validity$ = new BehaviorSubject<EdiValidity>({
    Gender: false,
    Ethnicity: false,
    Religion: false,
    Disability: false,
 //   Nationality: false,
    SexualOrientation: false
  });
  constructor(private accountService: AccountService) { }

  load() {
    if (!this.options$.value) {
      return this.accountService.getEdiOptions().pipe(tap(data => {
        const optionsWithoutNationality = {
          ethnicity: data.ethnicity,
          sections: data.sections.slice(0).filter(section => section.name !== 'Nationality')
        };
        this.options$.next(optionsWithoutNationality);
      }));
    } else {
      return observableOf(this.options$.value);
    }
  }

  get options() {
    return this.options$.value;
  }

  notSelected() {
    const notselected = {
      selected: 0,
      other: ''
    };
    const selection = {
      ethnicity: Object.assign({}, notselected),
      sections: {}
    };
    this.options.sections.forEach(section => {
      selection.sections[section.name] = Object.assign({}, notselected);
    });
    return selection;
  }

  selectionToModel(selection): EqualityDiversity {

    const edi: EqualityDiversity = {
      ethnicity: undefined,
      ethnicityOther: '',
      nationality: undefined,
      religion: undefined,
      religionOther: '',
      disabled: undefined,
      disabilityDetails: '',
      gender: undefined,
      sexualOrientation: undefined
    };
    edi.ethnicity = selection.ethnicity.selected;
    edi.ethnicityOther = this.isOtherEthnicity(edi.ethnicity) ? selection.ethnicity.other : '';

    for (const name in selection.sections) {
      const section = selection.sections[name];
      switch (name.toLowerCase()) {
    /*    case 'nationality':
          edi.nationality = section.selected || undefined;
        break;*/
        case 'religion':
          edi.religion = section.selected || undefined;
          if (this.isOtherSection(this.options.sections.filter(s => s.name === name)[0], edi.religion)) {
            edi.religionOther = section.other;
          }
        break;
        case 'disability':
          edi.disabled = section.selected || undefined;
          if (this.isOtherSection(this.options.sections.filter(s => s.name === name)[0], edi.disabled)) {
            edi.disabilityDetails = section.other;
          }
        break;
        case 'gender':
          edi.gender = section.selected || undefined;
        break;
        case 'sexualorientation':
          edi.sexualOrientation = section.selected || undefined;
      }
    }
    return edi;
  }

  getSummary(model: EqualityDiversity) {
    return this.load().pipe(map(options => {
      const ethnicity = options.ethnicity.reduce((acc, item) => {
        const selected = item.subGroups.find(sg => sg.id === model.ethnicity);
        if (selected) {
          acc = item.group;
          if (selected.isOther) {
            acc += ' - ' + model.ethnicityOther;
          } else {
            acc += ' - ' + selected.name;
          }
        }
        return acc;
      }, '');

      const disabled = options.sections.find(s => s.name === 'Disability').groups
        .reduce((acc, item) => {
          if (item.id === model.disabled) {
            acc = item.name;
            if (item.name === 'Yes') {
              acc += ' - ' + model.disabilityDetails;
            }
          }
          return acc;
        }, '');
/*
      const nationality = options.sections.find(s => s.name === 'Nationality').groups
        .reduce((acc, item) => {
          if (item.id === +model.nationality) {
            acc = item.name;
          }
          return acc;
        }, '');
*/
      const religion = options.sections.find(s => s.name === 'Religion').groups
        .reduce((acc, item) => {
          if (item.id === model.religion) {
            acc = item.name;
            if (item.isOther) {
              acc += ' - ' + model.religionOther;
            }
          }
          return acc;
        }, '');

      const sexualOrientation = options.sections.find(s => s.name === 'SexualOrientation').groups
        .reduce((acc, item) => {
          if (item.id === model.sexualOrientation) {
            acc = item.name;
          }
          return acc;
        }, '');

      const gender = options.sections.find(s => s.name === 'Gender').groups
        .reduce((acc, item) => {
          if (item.id === model.gender) {
            acc = item.name;
          }
          return acc;
        }, '');

      return [
        { name: 'Ethnicity', value: ethnicity},
        { name: 'Religion', value: religion },
      //  { name: 'Nationality', value: nationality },
        { name: 'Disability', value: disabled },
        { name: 'Sexual orientation', value: sexualOrientation },
        { name: 'Gender', value: gender }
      ];

    }));

  }

  validate(model: EqualityDiversity): StepValidity {
    if (!this.options) { return; }
    const valid = {
      Gender: true,
      Ethnicity: true,
      Religion: true,
      Disability: true,
   //   Nationality: true,
      SexualOrientation: true
    };
    const messages = [];
    if (!model.gender) {
      valid.Gender = false;
      messages.push('You haven\'t specified your gender');
    }
    if (!model.disabled) {
      valid.Disability = false;
      messages.push('You haven\'t specified your disability status');
    } else {
      // const disabilitySection = this.options.sections.filter(s => s.name.toLowerCase() === 'disability')[0];
      // console.log(disabilitySection);
      // console.log(model.disabled);
      // console.log(model.disabilityDetails);
      // if (this.isOtherSection(disabilitySection, model.disabled) && !model.disabilityDetails) {
      //   messages.push('You haven\'t specified your disability');
      //   valid.Disability = false;
      // }
    }
    if (!model.ethnicity) {
      messages.push('You haven\'t selected your ethnicity');
      valid.Ethnicity = false;
    } else {
      if (this.isOtherEthnicity(model.ethnicity) && !model.ethnicityOther) {
        messages.push('You haven\'t selected your ethnicity');
        valid.Ethnicity = false;
      }
    }
 /*   if (!model.nationality) {
      messages.push('You haven\'t selected your nationality');
      valid.Nationality = false;
    }*/
    if (!model.religion) {
      messages.push('You haven\'t selected your religion');
      valid.Religion = false;
    } else {
      // const religionSection = this.options.sections.filter(s => s.name.toLowerCase() === 'religion')[0];
      // if (this.isOtherSection(religionSection, model.religion) && !model.religionOther) {
      //   messages.push('You haven\'t specified your religion');
      //   valid.Religion = false;
      // }
    }
    if (!model.sexualOrientation) {
      messages.push('You haven\'t selected your sexual orientation');
      valid.SexualOrientation = false;
    }

    this.validity$.next(valid);
    return { valid: !messages.length, messages, touched: false };
  }

  selectionFromModel(model) {

    const selection = this.notSelected();
    this.options.ethnicity.forEach(group => {
      const ethnicity = group.subGroups.filter(g => g.id === model.ethnicity);
      if (ethnicity.length) {
        selection.ethnicity.selected = ethnicity[0].id;
      }
    });
    if (model.ethnicityOther) {
      selection.ethnicity.other = model.ethnicityOther;
    }

    this.options.sections.forEach(section => {
      if (section.name.toLowerCase() === 'gender') {
        const gender = section.groups.filter(g => g.id === model.gender);
        if (gender.length) {
          selection.sections[section.name].selected = gender[0].id;
        }
      }
 /*     if (section.name.toLowerCase() === 'nationality') {
        const nationality = section.groups.filter(g => g.id === model.nationality);
        if (nationality.length) {
          selection.sections[section.name].selected = nationality[0].id;
        }
      }*/
      if (section.name.toLowerCase() === 'religion') {
        const religion = section.groups.filter(g => g.id === model.religion);
        if (religion.length) {
          selection.sections[section.name].selected = religion[0].id;
          if (model.religionOther) {
            selection.sections[section.name].other = model.religionOther;
          }
        }
      }
      if (section.name.toLowerCase() === 'disability') {
        const disabled = section.groups.filter(g => g.id === model.disabled);
        if (disabled.length) {
          selection.sections[section.name].selected = disabled[0].id;
          if (model.disabilityDetails) {
            selection.sections[section.name].other = model.disabilityDetails;
          }
        }
      }
      if (section.name.toLowerCase() === 'sexualorientation') {
        const sexualOrientation = section.groups.filter(g => g.id === model.sexualOrientation);
        if (sexualOrientation.length) {
          selection.sections[section.name].selected = sexualOrientation[0].id;
        }
      }
    });
    return selection;
  }

  isOtherEthnicity(id) {
    let selected;
    this.options.ethnicity.forEach(group => {
      const ethnicity = group.subGroups.filter(g => g.id === id);
      if (ethnicity.length) {
        selected = ethnicity[0];
      }
    });
    return selected && selected.isOther;
  }

  isOtherSection(section, id) {
    const selected = section.groups.filter(g => g.id === id);
    if (selected.length) {
      if (section.name.toLowerCase() === 'disability' && selected[0].name.toLowerCase() === 'yes') {
        return true;
      }
      return selected[0].isOther;
    }
  }
  isOtherSectionMandatory(section, id) {
    return this.isOtherSection(section, id) && section.name !== 'Disability' && section.name !== 'Religion';
  }

}
