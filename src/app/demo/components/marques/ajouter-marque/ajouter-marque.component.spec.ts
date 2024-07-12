import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterMarqueComponent } from './ajouter-marque.component';

describe('AjouterMarqueComponent', () => {
  let component: AjouterMarqueComponent;
  let fixture: ComponentFixture<AjouterMarqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjouterMarqueComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AjouterMarqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
