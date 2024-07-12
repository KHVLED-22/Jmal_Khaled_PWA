import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPointagesComponent } from './list-pointages.component';

describe('ListPointagesComponent', () => {
  let component: ListPointagesComponent;
  let fixture: ComponentFixture<ListPointagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListPointagesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListPointagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
