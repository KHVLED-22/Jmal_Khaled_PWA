import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterImagesComponent } from './ajouter-images.component';

describe('AjouterImagesComponent', () => {
  let component: AjouterImagesComponent;
  let fixture: ComponentFixture<AjouterImagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjouterImagesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AjouterImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
