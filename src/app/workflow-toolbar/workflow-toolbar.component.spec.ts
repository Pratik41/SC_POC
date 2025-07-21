import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowToolbarComponent } from './workflow-toolbar.component';

describe('WorkflowToolbarComponent', () => {
  let component: WorkflowToolbarComponent;
  let fixture: ComponentFixture<WorkflowToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkflowToolbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
