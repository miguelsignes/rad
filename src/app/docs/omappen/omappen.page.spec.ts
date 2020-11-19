import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OmappenPage } from './omappen.page';

describe('OmappenPage', () => {
  let component: OmappenPage;
  let fixture: ComponentFixture<OmappenPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OmappenPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OmappenPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
