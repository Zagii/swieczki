import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {
  Candle,
  KalkulacjeData,
  KalkulacjeObjct,
  KalkulacjeParametry
} from './Candle';
import { RestService } from './rest.service';
import { WsServiceService } from './ws-service.service';

@Injectable()
export class KalkulacjeService {
  constructor(
    private restService: RestService,
    private wsService: WsServiceService
  ) {}

  symbol: string = 'BTCUSDT';
  symbolSubj = new Subject<string>();
  resultResp;
  swieczkiResp;
  miniTickerResp;
  connectionStatus: string;

  dataTab15m: Candle[] = [];
  dataTab1m: Candle[] = [];

  calcObj: KalkulacjeObjct;

  swieczki15minSubj = new Subject<Candle[]>();
  swieczki1minSubj = new Subject<Candle[]>();
  calcObjSubj = new Subject<KalkulacjeObjct>();

  bylCalcInit: boolean = false;
  maxSwieczek = 50;

  public getCalcObjSubj() {
    return this.calcObjSubj;
  }
  public initCalcObj() {
    this.calcObj = {} as KalkulacjeObjct;
    this.calcObj.data = {} as KalkulacjeData;
    this.calcObj.data.maxKurs = -Infinity;
    this.calcObj.data.minKurs = Infinity;
    this.calcObj.parametry = {} as KalkulacjeParametry;
  }
  public calcParamsInit() {
    if (this.bylCalcInit) return;
    this.initCalcObj();
    this.bylCalcInit = true;
  }
  public calcParamsUpdate() {
    this.calcObj.data.maxKurs = this.restService.maxKurs(
      this.dataTab15m,
      0,
      this.calcObj.parametry.cnt15min
    );
    //  let tmp = this.restService.maxKurs(this.dataTab1m);
    //  if (tmp > this.calcObj.data.maxKurs) this.calcObj.data.maxKurs = tmp;

    this.calcObj.data.minKurs = this.restService.minKurs(
      this.dataTab15m,
      0,
      this.calcObj.parametry.cnt15min
    );
    //tmp = this.restService.minKurs(this.dataTab1m);
    //if (tmp < this.calcObj.data.minKurs) this.calcObj.data.minKurs = tmp;

    let ostatnia1m;
    let ostatnia15m;

    if (this.dataTab1m && this.dataTab1m.length > 0)
      ostatnia1m = this.dataTab1m[this.dataTab1m.length - 1];

    if (this.dataTab15m && this.dataTab15m.length > 0)
      ostatnia15m = this.dataTab15m[this.dataTab15m.length - 1];

    if (ostatnia1m && ostatnia15m) {
      if (ostatnia1m.openTime > ostatnia15m.openTime)
        this.calcObj.data.kurs = +ostatnia1m.close;
    } else if (ostatnia1m) this.calcObj.data.kurs = +ostatnia1m.close;
    else if (ostatnia15m) this.calcObj.data.kurs = +ostatnia15m.close;
    else {
      console.log('ERR kalkulacje:calcUpdate');
      return;
    }

    let marginPips =
      (this.calcObj.data.kurs * this.calcObj.parametry.marginesProcent) / 100;
    this.calcObj.data.buyLvl = this.calcObj.data.kurs + marginPips;
    this.calcObj.data.sellLvl = this.calcObj.data.kurs - marginPips;

    this.calcObjSubj.next(this.calcObj);
  }

  public getSwieczki15minSub() {
    return this.swieczki15minSubj;
  }
  public getSwieczki1minSub() {
    return this.swieczki1minSubj;
  }
  dodajSwieczke(i: string, c: Candle) {
    //console.log('dodajSwieczke');
    switch (i) {
      case '1m':
        while (this.dataTab1m.length > this.maxSwieczek) this.dataTab1m.shift();

        this.dataTab1m.push(c);
        this.swieczki1minSubj.next(this.dataTab1m);
        break;
      case '15m':
        while (this.dataTab15m.length > this.maxSwieczek) this.dataTab15m.shift();
        this.dataTab15m.push(c);
        this.swieczki15minSubj.next(this.dataTab15m);
        break;
    }
  }
  aktualizujOstatniaSwieczke(i: string, c: Candle) {
    //console.log('aktualizacja ' + i);
    switch (i) {
      case '1m':
        this.dataTab1m[this.dataTab1m.length - 1] = c;
        this.swieczki1minSubj.next(this.dataTab1m);
        break;
      case '15m':
        this.dataTab15m[this.dataTab15m.length - 1] = c;
        this.swieczki15minSubj.next(this.dataTab15m);
        break;
    }
  }
  swieczkaMsg(msg) {
    //console.log(msg.s);
    if (msg.s != this.symbol) return;
    //console.log(msg.k.t + " " + this.dataTab1m.length);
    let ostatnia: Candle;
    let interwal = msg.k.i;
    //    console.log(interwal)
    switch (interwal) {
      case '1m':
        ostatnia = this.dataTab1m[this.dataTab1m.length - 1];

        break;
      case '15m':
        ostatnia = this.dataTab15m[this.dataTab15m.length - 1];
        break;
    }
    let nowa = this.wsService.klineToCandle(msg.k);

    if (nowa.openTime == ostatnia.openTime) {
      this.aktualizujOstatniaSwieczke(interwal, nowa);
    } else this.dodajSwieczke(interwal, nowa);
  }
  tickerMsg(msg) {
    // console.log(msg);
  }
  parseMsg(msg: any) {
    // console.log(msg);
    let res = msg.result;
    if (res) this.resultResp = res;
    let e = msg.e;
    if (!e) return;
    switch (e) {
      case 'kline':
        this.swieczkiResp = JSON.stringify(msg, null, 2);
        this.swieczkaMsg(msg);
        break;
      case '24hrMiniTicker':
        this.miniTickerResp = JSON.stringify(msg, null, 2);
        this.tickerMsg(this.miniTickerResp);
        break;
    }
  }
  public setSymbol(s: string, count15min: number, marginPrc: number) {
    this.bylCalcInit = false;
    this.initCalcObj();
    this.calcObj.parametry.marginesProcent = marginPrc;
    this.calcObj.parametry.cnt15min = count15min;
    this.symbol = s.toUpperCase();

    this.restService
      .getCandleData(
        this.symbol,
        '15m',
        this.calcObj.parametry.cnt15min.toString()
      )
      .subscribe((val: Candle[]) => {
        this.dataTab15m = val;
        this.dataTab15m = this.dataTab15m.map(x =>
          this.restService.mapCandle(x)
        );
        this.swieczki15minSubj.next(this.dataTab15m);
        console.log('mam 15min');
        this.calcParamsUpdate();
      });
    this.restService
      .getCandleData(this.symbol, '1m', '15')
      .subscribe((val: Candle[]) => {
        this.dataTab1m = val;
        this.dataTab1m = this.dataTab1m.map(x => this.restService.mapCandle(x));
        this.calcParamsUpdate();
      });
    this.wsService.init(false);
    this.wsService.subUnsubAll();

    this.symbolSubj.next(this.symbol);
    this.wsService.subscribe(this.symbol.toLowerCase() + '@kline_15m');
    this.wsService.subscribe(this.symbol.toLowerCase() + '@kline_1m');
    this.calcParamsInit();
  }
  public getSymbolData(s: string) {}
  public init() {
    this.wsService.getMsgSubject().subscribe(x => this.parseMsg(x));
    this.wsService.getConnectionSubject().subscribe(x => this.connectionStatus);
  }
  public destroy() {
    this.wsService.subUnsubAll();
  }
}
