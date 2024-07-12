import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListemployeComponent } from './listemploye.component';

describe('ListemployeComponent', () => {
  let component: ListemployeComponent;
  let fixture: ComponentFixture<ListemployeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListemployeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListemployeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
