import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RenewalMessageComponent } from "./renewalMessage.component";

describe('RenewalMessage Component', () => {
    let fixture: ComponentFixture<RenewalMessageComponent>, component:RenewalMessageComponent;
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ RenewalMessageComponent ]
        }).compileComponents();

        fixture = TestBed.createComponent(RenewalMessageComponent);
        component = fixture.componentInstance;
    });

    it('should init correctly', () => {
        expect(component).toBeTruthy();
    })
});