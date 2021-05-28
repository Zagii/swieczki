import { Component, OnInit } from "@angular/core";
import { WsServiceService } from "../ws-service.service";

@Component({
  selector: "app-ekran-debug",
  templateUrl: "./ekran-debug.component.html",
  styleUrls: ["./ekran-debug.component.css"]
})
export class EkranDebugComponent implements OnInit {
  connectionStatus: string;
  resultResp;
  aggTradeResp;
  depthResp;
  listOfSubsctiptionsResp;
  tradeResp;
  swieczkiResp;
  miniTickerResp;
  tickerResp;
  bookTickerResp;

  constructor(private wsService: WsServiceService) {}

  parseMsg(msg: any) {
    //console.log(msg);
    let res = msg.result;
    if (res) this.resultResp = res;
    let e = msg.e;
    if (!e) return;
    switch (e) {
      case "aggTrade":
        this.aggTradeResp = JSON.stringify(msg, null, 2);
        break;
      case "trade":
        this.tradeResp = JSON.stringify(msg, null, 2);
        break;
      case "kline":
        this.swieczkiResp = JSON.stringify(msg, null, 2);
        break;
      case "24hrMiniTicker":
        this.miniTickerResp = JSON.stringify(msg, null, 2);
        break;
      case "24hrTicker":
        this.tickerResp = JSON.stringify(msg, null, 2);
        break;
      case "depthUpdate":
        this.depthResp = JSON.stringify(msg, null, 2);
        break;
    }
  }

  ngOnInit() {
    this.wsService.getMsgSubject().subscribe(x => this.parseMsg(x));
    this.wsService.getConnectionSubject().subscribe(x => this.connectionStatus);
  }
  public connectWSclick(flaga) {
    if (flaga) {
      this.wsService.init(false);
    } else {
      this.wsService.disconnect();
    }
  }
  public getListOfSubscriptions() {
    this.wsService.getListSubscription();
  }
  public aggTrade(flaga) {
    if (flaga) this.wsService.subscribe("btcusdt@aggTrade");
    else this.wsService.unsubscribe("btcusdt@aggTrade");
  }
  public depth(flaga) {
    if (flaga) this.wsService.subscribe("btcusdt@depth");
    else this.wsService.unsubscribe("btcusdt@depth");
  }
  public trade(flaga) {
    if (flaga) this.wsService.subscribe("btcusdt@trade");
    else this.wsService.unsubscribe("btcusdt@trade");
  }
  public swieczki(flaga, interval) {
    if (flaga) this.wsService.subscribe("btcusdt@kline_"+interval);
    else this.wsService.unsubscribe("btcusdt@kline_"+interval);
  }
  public miniTicker(flaga) {
    if (flaga) this.wsService.subscribe("btcusdt@miniTicker");
    else this.wsService.unsubscribe("btcusdt@miniTicker");
  }
  public ticker(flaga) {
    if (flaga) this.wsService.subscribe("btcusdt@ticker");
    else this.wsService.unsubscribe("btcusdt@ticker");
  }
  public bookTicker(flaga) {
    if (flaga) this.wsService.subscribe("btcusdt@bookTicker");
    else this.wsService.unsubscribe("btcusdt@bookTicker");
  }
}
