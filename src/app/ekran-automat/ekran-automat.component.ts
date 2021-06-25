import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { Candle, KalkulacjeObjct } from '../Candle';
import { KalkulacjeService } from '../kalkulacje.service';

@Component({
  selector: 'app-ekran-automat',
  templateUrl: './ekran-automat.component.html',
  styleUrls: ['./ekran-automat.component.css']
})
export class EkranAutomatComponent implements OnInit, OnDestroy {
  symbol: string;
  swieczki15m: Candle[];
  swieczki1m: Candle[];
  dropdownOkres = [
    { opis: '1x15min= 15min', wartosc: 1 },
    { opis: '2x15min= 30min', wartosc: 2 },
    { opis: '3x15min= 45min', wartosc: 3 },
    { opis: '5x15min= 1h 15', wartosc: 5 },
    { opis: '8x15min= 2h', wartosc: 8 },
    { opis: '13x15min= 3h 15min', wartosc: 13 },
    { opis: '21x15min=5h 15min', wartosc: 21 },
    { opis: '34x15min= 8h 30min', wartosc: 34 },
    { opis: '55x15min= 13h 45min', wartosc: 55 },
    { opis: '89x15min= 22h 15min', wartosc: 89 },
    { opis: '144x15min= 1d 12h', wartosc: 144 }
  ];
  defOkresIndex = 5;
  wybranyOkres: number;
  count15min: number;
  calcObj: KalkulacjeObjct;

  deltaSL: number = 10;
  poczatekSL: number = 1;
  przyrostSL: number = 15;
  progBuyProc: number = 100;
  progBuyKwota: number = 100;
  progSellProc: number = 100;
  progSellKwota: number = 100;
  wartoscZakladu:number=1;

  private calcObjSub: Subject<KalkulacjeObjct>;

  private candle1mSubs: Subject<Candle[]>;
  private candle15mSubs: Subject<Candle[]>;

  constructor(
    private route: ActivatedRoute,
    private kalkulacje: KalkulacjeService
  ) {
    this.zmienOkres(this.defOkresIndex);
  }

  ngOnDestroy(): void {
    this.candle1mSubs.unsubscribe();
    this.candle15mSubs.unsubscribe();
    this.calcObjSub.unsubscribe();
    this.kalkulacje.destroy();
  }

  getSymbolID(): void {
    this.symbol = this.route.snapshot.paramMap.get('id');
    this.kalkulacje.setSymbol(this.symbol, 50, 100);
  }
  ngOnInit() {
    this.getSymbolID();
    this.kalkulacje.init();
    this.candle1mSubs = this.kalkulacje.getSwieczki1minSub();
    this.candle1mSubs.subscribe(x => (this.swieczki1m = x));
    this.candle15mSubs = this.kalkulacje.getSwieczki15minSub();
    this.candle15mSubs.subscribe(x => (this.swieczki15m = x));
    this.calcObjSub = this.kalkulacje.getCalcObjSubj();
    this.calcObjSub.subscribe(x => (this.calcObj = x));
  }
  zmienOkres(index) {
    this.wybranyOkres = index;
    this.count15min = this.dropdownOkres[this.wybranyOkres].wartosc;
    console.log('Nowy okres: ' + this.count15min + ' x 15min swieczek');
  }
  updateOkres(e) {
    let i = e.target.value;
    // console.log(e.target);
    // console.log('Update: ' + i);
    this.zmienOkres(i);
  }
  changeSL() {
    console.log('changeSL' + this.deltaSL);
  }
}
