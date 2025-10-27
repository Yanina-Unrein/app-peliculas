import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpcomingContainer } from './upcoming-container';

describe('UpcomingContainer', () => {
  let component: UpcomingContainer;
  let fixture: ComponentFixture<UpcomingContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpcomingContainer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpcomingContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
