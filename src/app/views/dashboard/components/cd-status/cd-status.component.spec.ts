import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CdStatusComponent } from './cd-status.component';

describe('CdStatusComponent', () => {
  let component: CdStatusComponent;
  let fixture: ComponentFixture<CdStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CdStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CdStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
