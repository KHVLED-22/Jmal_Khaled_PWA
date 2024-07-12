import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierVariationComponent } from './modifier-variation.component';

describe('ModifierVariationComponent', () => {
  let component: ModifierVariationComponent;
  let fixture: ComponentFixture<ModifierVariationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifierVariationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModifierVariationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
