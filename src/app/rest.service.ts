import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { Candle } from './Candle';

const api: Array<Object> = [
  { co: 'time', adr: '/api/v3/time' },
  { co: 'exchangeInfo', adr: '/api/v3/exchangeInfo' },
  { co: 'candle', adr: '/api/v3/klines' }
];
@Injectable()
export class RestService {
  // private restUrl = "https://testnet.binance.vision";
  private restUrl = 'https://api.binance.com';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
      //  "api-key":
      //"qJVCjwyBVOLxwlv8XrPO0cz4CkboFIGw6iuFHi3GnWsjMmahvq7UEP2mSwaLtobm",
      //  "api-secret":
      //"xeW94ie6giDiPTXYknzgmiR5osF8op1nGpCgJrO58Ln3uuGsY6Y5FnJjeuKn8803"
    })
  };

  constructor(private http: HttpClient) {}
  getServerTime(): Observable<Object[]> {
    let url = this.restUrl + '/api/v3/time';
    // url = this.restUrl +'/api/v3/exchangeInfo';
    //url = 'http://www.google.pl';
    console.log(url);
    return this.http
      .get<Object[]>(url)
      .pipe(catchError(this.handleError<Object[]>('getServerTime', [])));
  }
  get(x: String): Observable<Object[]> {
    let url = this.restUrl + api.find(a => a['co'] == x)['adr'];
    console.log(url);
    return this.http
      .get<Object[]>(url)
      .pipe(catchError(this.handleError<Object[]>('get' + x, [])));
  }

  getCandleData(
    symbol: string,
    interval: string,
    limit: string
    //,startTime:Number,endTime:Number
  ) {
    let params = new HttpParams()
      .set('symbol', symbol)
      .set('interval', interval)
      .set('limit', limit);
    let url = this.restUrl + api.find(a => a['co'] == 'candle')['adr'];
    console.log(url);
    return this.http
      .get<Candle[]>(url, { params })
      .pipe(catchError(this.handleError<Candle[]>('getCandleData', [])));
  }
  mapCandle(t: Candle) {
    let c: Candle = {};
    c.openTime = t[0];
    c.open = t[1];
    c.high = t[2];
    c.low = t[3];
    c.close = t[4];
    c.volume = t[5];
    c.closeTime = t[6];
    c.basseAssetVol = t[7];
    c.numberOfTrades = t[8];
    c.takerBuyVolume = t[9];
    c.takerBuyAssetVolume = t[10];
    c.ignore = t[11];
    return c;
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
  calculateMA(dayCount, data) {
    var result = [];
    // console.log(data)
    if (data === null) return result;
    for (var i = 0, len = data.length; i < len; i++) {
      if (i < dayCount) {
        result.push('-');
        continue;
      }
      var sum = 0;
      for (var j = 0; j < dayCount; j++) {
        sum += +data[i - j][1];
      }
      result.push(sum / dayCount); //.toFixed(2));
    }
    return result;
  }
  calculateDates(tab: Candle[]) {
    let result: string[] = [];
    if (tab === null) return result;
    result = tab.map(x => new Date(x.openTime).toLocaleString());
    // console.log("calcDates");
    //console.log(result);
    return result;
  }
  calculateVolumes(tab: Candle[]) {
    let result = [];
    if (tab === null) return result;
    result = tab.map(x => x.volume);
    //console.log("calculateVolumes");
    // console.log(result);
    return result;
  }
  calculateData(tab: Candle[]) {
    let result = [];
    if (tab === null) return result;
    //  console.log("calculateData: "+tab.length)
    result = tab.map(x => [x.open, x.close, x.low, x.high, x.volume]);

    //console.log(result);
    return result;
  }
  /** tab tablica, start,end zakres rozpatrywanych pol */
  maxKurs(tab: Candle[], start?: number, end?: number): number {
    let s = 0,
      e = tab.length - 1;
    if (start) s = start;
    if (end) e = end;
    let t = tab.slice(s, e);
    return Math.max.apply(Math, t.map(o => +o.high));
  }
  /** tab tablica, start,end zakres rozpatrywanych pol */
  minKurs(tab: Candle[], start?: number, end?: number): number {
    let s = 0,
      e = tab.length - 1;
    if (start) s = start;
    if (end) e = end;
    let t = tab.slice(s, e);
    return Math.min.apply(Math, t.map(o => +o.low));
  }
}
