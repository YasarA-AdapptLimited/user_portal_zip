import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { BrowserDialogComponent } from './browser-dialog.component';

describe('BrowserDialogComponent', () => {
  let component: BrowserDialogComponent;
  let fixture: ComponentFixture<BrowserDialogComponent>;
  let MockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports:[MatDialogModule],
      declarations: [ BrowserDialogComponent ],
      providers: [{ provide: MatDialogRef, useValue: MockDialogRef},
        { provide: MAT_DIALOG_DATA, useValue: {} }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowserDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('close method should close the dialog', () => {    
    component.close();
    expect(MockDialogRef.close).toHaveBeenCalled();
  });

  it('content defines message', () => {
    expect(component.content).toBe('Please change setting to allow third party cookies');
  });

  it('title property defines title test conditionally', () => {
    expect(component.title).toBe('Your browser has blocked thirdparty cookies');
  });
});
