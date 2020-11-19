import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { KontaktPage } from './kontakt.page';

describe('KontaktPage', () => {
  let component: KontaktPage;
  let fixture: ComponentFixture<KontaktPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KontaktPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(KontaktPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
