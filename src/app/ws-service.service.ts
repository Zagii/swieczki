import { Injectable } from '@angular/core';
import * as Rx from 'rxjs/Rx';
import { Observable, Subject } from 'rxjs/Rx';
import { webSocket } from 'rxjs/webSocket';
import { Candle } from './Candle';

const connMainnetUrl = 'wss://stream.binance.com:9443/ws'; //"wss://dex.binance.org/api/ws";
const connTestNetUrl = 'wss://testnet-dex.binance.org/api/ws';

@Injectable()
export class WsServiceService {
  url = '';
  topikTab: string[] = [];
  wsSubject;
  myId: number = 1;
  constructor() {}
  wsMsg = new Subject<any>();
  private subject: Rx.Subject<MessageEvent>;
  private isConnected = new Subject<string>();

  // private kline1m = new Subject<string>();
  // private kline15m = new Subject<string>();
  // private miniTicker = new Subject<string>();

  // public getKline1m(){return this.kline1m;}
  // public getKline15m(){return this.kline15m;}
  //public getMiniTicker(){return this.miniTicker;}

  public getConnectionSubject() {
    return this.isConnected;
  }

  public init(test: boolean) {
    this.url = test ? connTestNetUrl : connMainnetUrl;
    console.log('Init webSocket: ' + this.url);
    // setInterval(() => {
    //  console.log("Sending KeepAlive");
    //  }, 20000);
    this.connect(this.url);
  }
  public getListSubscription() {
    this.send({ method: 'LIST_SUBSCRIPTIONS', id: this.myId++ });
  }
  public disconnect() {
    this.wsSubject.complete();
  }
  public destroy() {
    this.subUnsubAll();
    this.disconnect();
  }
  public subUnsub(metoda: string, topic: string) {
    let arr: string[] = [];
    arr.push(topic);

    this.send({ method: metoda, params: arr, id: this.myId++ });
  }
  public subUnsubAll() {
    this.topikTab.forEach(x => this.unsubscribe(x));
  }
  public subscribe(topic: string) {
    let e = this.topikTab.find(x => x == topic);
    if (e != undefined) {
      console.log(
        'WsServiceService:subscribe(' + topic + ') juz subskrybowany'
      );
      return;
    }
    console.log('WsServiceService:subscribe(' + topic + ') subskrypcja OK');
    this.subUnsub('SUBSCRIBE', topic);
    this.topikTab.push(topic);
  }

  public unsubscribe(topic: string) {
    let e = this.topikTab.find(x => x == topic);
    if (e != undefined) {
      this.topikTab = this.topikTab.filter(x => x != topic);
      this.subUnsub('UNSUBSCRIBE', topic);
      console.log('WsServiceService:unsubscribe(' + topic + ') usunieto');
      return;
    }
    console.log('WsServiceService:unsubscribe(' + topic + ') brak subskrypcji');
  }
  public getSubTab() {
    return this.topikTab;
  }
  public getMsgSubject(): Subject<any> {
    return this.wsMsg;
  }

  public onMsg(msg) {
    //console.log("message received: ");
     //console.log(msg);
    this.wsMsg.next(msg);
  }
  public onErr(msg) {
    console.log('error message received: ' + msg);
    console.log(JSON.stringify(msg, ['message', 'arguments', 'type', 'name']));
    this.isConnected.next('error');
  }
  public onClose() {
    console.log('ws complete');
    this.isConnected.next('not connected');
  }
  public connect(url) {
    if (this.wsSubject && this.wsSubject.readyState === WebSocket.OPEN) {
      console.log('Nie lacze, juz polaczono');
      return;
    }
    this.wsSubject = webSocket(url);
    this.isConnected.next('connected');
    this.wsSubject.subscribe(
      msg => this.onMsg(msg), // Called whenever there is a message from the server.
      err => this.onErr(err), // Called if at any point WebSocket API signals some kind of error.
      () => this.onClose() // Called when connection is closed (for whatever reason).
    );
  }
  public send(msg) {
    let msgStr = JSON.stringify(msg);
    console.log('ws_send>' + msg);
    this.wsSubject.next(msg);
  }

  public klineToCandle(k: any):Candle
  {
    //console.log(k)
    let r: Candle={};
    r.openTime=k.t;
    r.open=k.o;
    r.high=k.h;
    r.low=k.l;
    r.close=k.c;
    r.volume=k.q;
    r.closeTime=k.T;
    r.basseAssetVol=k.v;
    r.numberOfTrades=k.n;
    r.takerBuyVolume=k.V;
    r.takerBuyAssetVolume=k.Q;
    r.ignore=k.B;
  //  console.log(r)
    return r;
  }

  ////////////////////////// usunac ////////////////
  /* public connect2(url): Rx.Subject<MessageEvent> {
    if (!this.subject) {
      this.subject = this.create2(url);
      console.log("Successfully connected: " + url);
    }
    return this.subject;
  }

  private create2(url): Rx.Subject<MessageEvent> {
    let ws = new WebSocket(url);

    let observable = Rx.Observable.create((obs: Rx.Observer<MessageEvent>) => {
      ws.onmessage = obs.next.bind(obs);
      ws.onerror = obs.error.bind(obs);
      ws.onclose = obs.complete.bind(obs);
      return ws.close.bind(ws);
    });
    let observer = {
      next: (data: Object) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(data));
        }
      }
    };
    return Rx.Subject.create(observer, observable);
  }
  public send2(msg) {
    this.subject.next(msg);
    console.log("send >");
    console.log(msg);
  }*/
}
