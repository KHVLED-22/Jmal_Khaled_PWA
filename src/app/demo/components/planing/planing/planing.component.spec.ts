import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaningComponent } from './planing.component';

describe('PlaningComponent', () => {
  let component: PlaningComponent;
  let fixture: ComponentFixture<PlaningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaningComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlaningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
