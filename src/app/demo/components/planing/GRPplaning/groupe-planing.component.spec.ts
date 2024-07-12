import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupePlaningComponent } from './groupe-planing.component';

describe('GroupePlaningComponent', () => {
  let component: GroupePlaningComponent;
  let fixture: ComponentFixture<GroupePlaningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupePlaningComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GroupePlaningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
