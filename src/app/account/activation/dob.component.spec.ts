import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DobComponent } from "./dob.component";

describe('DOB Component', () => {
    let fixture: ComponentFixture<DobComponent>;
    let component: DobComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ DobComponent ]
        }).compileComponents();    
        fixture = TestBed.createComponent(DobComponent);
        component = fixture.componentInstance;
        component.months = [
            { id: 0, name: "Month", days: 0 },
            { id: 1, name: "January", days: 31 },
            { id: 2, name: "February", days: 29 },
            { id: 3, name: "March", days: 31 },
            { id: 4, name: "April", days: 30 },
            { id: 5, name: "May", days: 31 },
            { id: 6, name: "June", days: 30 },
            { id: 7, name: "July", days: 31 },
            { id: 8, name: "August", days: 31 },
            { id: 9, name: "September", days: 30 },
            { id: 10, name: "October", days: 31 },
            { id: 11, name: "November", days: 30 },
            { id: 12, name: "December", days: 31 }
          ];
    });

    it('should init correctly', () => {
        expect(component).toBeTruthy();
    });

    it('check if dob month is valid', () => {
        component.dob.month = null;
        expect(component.entered()).toBe(false);
    });

    it('check if dob day is valid', () => {
        component.dob.month = 1;
        component.dob.day = null;
        expect(component.entered()).toBe(false);
    });

    it('check if dob month is valid', () => {
        component.dob.month = 1;
        component.dob.day = '1';
        component.yearSupplied = null;
        expect(component.entered()).toBe(false);
    });

    it('check if dob date is valid', () => {
        component.dob.month = 1;
        component.dob.day = '1';
        component.yearSupplied = true;
        expect(component.entered()).toBe(true);
    });

    it('yearEntered updates yearSupplied', () => {
        const validateSpy: jasmine.Spy = spyOn(component, 'validate');
        component.yearEntered();
        expect(component.yearSupplied).toBeTrue();
        expect(validateSpy).toHaveBeenCalled();
    });

    it('validateMonth updates DOB month', () => {
        const validateSpy: jasmine.Spy = spyOn(component, 'validate');
        component.validateMonth(0);
        expect(component.dob.month).toBe(0);
        expect(validateSpy).toHaveBeenCalled();
    });

    it('isValid returns false if dob month not defined',() => {
        component.dob.month = null;
        expect(component.isValid()).toBeFalse();
    });

    it('isValid returns false if dob day not defined',() => {
        component.dob.month = 1;
        component.dob.day = null;
        expect(component.isValid()).toBeFalse();
    });

    it('isValid returns false if dob year not defined',() => {
        component.dob.month = 1;
        component.dob.day = '1';
        component.dob.year = null;
        expect(component.isValid()).toBeFalse();
    });

    it('isValid returns true if dob defined',() => {
        component.dob.month = 1;
        component.dob.day = '1';
        component.dob.year = '2000';
        expect(component.isValid()).toBeTrue();
    });
});
