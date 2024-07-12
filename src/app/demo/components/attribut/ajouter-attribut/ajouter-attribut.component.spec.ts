import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterAttributComponent } from './ajouter-attribut.component';

describe('AjouterAttributComponent', () => {
  let component: AjouterAttributComponent;
  let fixture: ComponentFixture<AjouterAttributComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjouterAttributComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AjouterAttributComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
