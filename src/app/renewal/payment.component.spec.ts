import { ComponentFixture, TestBed } from "@angular/core/testing"
import { MatCheckboxModule } from "@angular/material/checkbox";
import { PaymentComponent } from "./payment.component";

describe('Renewal payment component', () => {
    let fixture: ComponentFixture<PaymentComponent>, component: PaymentComponent;

    beforeEach(()=> {
        TestBed.configureTestingModule({
            imports: [ MatCheckboxModule ],
            declarations: [ PaymentComponent ],
            providers: []
        }).compileComponents();

        fixture = TestBed.createComponent(PaymentComponent);
        component = fixture.componentInstance;
    })

    it('init correctly', () => {
        expect(component).toBeTruthy();
    })
})