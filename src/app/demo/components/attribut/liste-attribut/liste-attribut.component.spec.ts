import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeAttributComponent } from './liste-attribut.component';

describe('ListeAttributComponent', () => {
  let component: ListeAttributComponent;
  let fixture: ComponentFixture<ListeAttributComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeAttributComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListeAttributComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
