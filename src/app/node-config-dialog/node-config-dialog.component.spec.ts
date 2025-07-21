import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeConfigDialogComponent } from './node-config-dialog.component';

describe('NodeConfigDialogComponent', () => {
  let component: NodeConfigDialogComponent;
  let fixture: ComponentFixture<NodeConfigDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NodeConfigDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeConfigDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
