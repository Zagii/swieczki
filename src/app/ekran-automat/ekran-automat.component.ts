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

  calcObj: KalkulacjeObjct;

  private calcObjSub: Subject<KalkulacjeObjct>;

  private candle1mSubs: Subject<Candle[]>;
  private candle15mSubs: Subject<Candle[]>;

  constructor(
    private route: ActivatedRoute,
    private kalkulacje: KalkulacjeService
  ) {}

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
}
