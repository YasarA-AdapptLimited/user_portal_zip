import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RenewalSplashComponent } from "./renewalSplash.component";

describe('Renewal Splash Component', () => {
    let fixture: ComponentFixture<RenewalSplashComponent>, component: RenewalSplashComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [ RenewalSplashComponent ],
        }).compileComponents();

        fixture = TestBed.createComponent(RenewalSplashComponent);
        component = fixture.componentInstance;
    })

    it('init correctly', () => {
        expect(component).toBeTruthy();
    });
});