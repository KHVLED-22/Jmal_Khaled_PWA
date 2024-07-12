import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FicheCategorieComponent } from './fiche-categorie.component';

describe('FicheCategorieComponent', () => {
  let component: FicheCategorieComponent;
  let fixture: ComponentFixture<FicheCategorieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FicheCategorieComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FicheCategorieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
