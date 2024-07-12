import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeCouleurComponent } from './liste-couleur.component';

describe('ListeCouleurComponent', () => {
  let component: ListeCouleurComponent;
  let fixture: ComponentFixture<ListeCouleurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeCouleurComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListeCouleurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
