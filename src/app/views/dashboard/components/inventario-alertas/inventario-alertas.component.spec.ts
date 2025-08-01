import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventarioAlertasComponent } from './inventario-alertas.component';

describe('InventarioAlertasComponent', () => {
  let component: InventarioAlertasComponent;
  let fixture: ComponentFixture<InventarioAlertasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventarioAlertasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventarioAlertasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
