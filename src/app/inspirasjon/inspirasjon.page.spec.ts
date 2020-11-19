import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InspirasjonPage } from './inspirasjon.page';

describe('InsirasjonPage', () => {
  let component: InspirasjonPage;
  let fixture: ComponentFixture<InspirasjonPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InspirasjonPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InspirasjonPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
