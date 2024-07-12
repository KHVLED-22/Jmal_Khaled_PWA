import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tab1sComponent } from './tab1s.component';

describe('Tab1sComponent', () => {
  let component: Tab1sComponent;
  let fixture: ComponentFixture<Tab1sComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tab1sComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Tab1sComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
