import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormQuestionControlComponent } from "../dynamic/formQuestionControl.component";
import { DeclarationQuestionComponent } from "./declarationQuestion.component";

describe('Declaration Question component', () => {
    let fixture: ComponentFixture<DeclarationQuestionComponent>, component: DeclarationQuestionComponent; 

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [ DeclarationQuestionComponent, MockFormQuestionControlComponent ],
            providers: []
        }).compileComponents();

        fixture = TestBed.createComponent(DeclarationQuestionComponent);
        component = fixture.componentInstance;
    });

    it('init correctly', () => {
        expect(component).toBeTruthy();
    });
});

@Component({
    selector: 'app-form-question-control',
    template: ''
  })
class MockFormQuestionControlComponent {
}