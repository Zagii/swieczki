import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { RestService } from '.././rest.service';
import { BehaviorSubject } from 'rxjs';
import { Candle } from '../Candle';
import { KalkulacjeService } from '../kalkulacje.service';
import { WsServiceService } from '../ws-service.service';

@Component({
  selector: 'app-ekran-para',
  templateUrl: './ekran-para.component.html',
  styleUrls: ['./ekran-para.component.css']
})
export class EkranParaComponent implements OnInit, OnDestroy {
  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private restService: RestService,
    private kalkulacjeService: KalkulacjeService
  ) //  private wsService: WsServiceService
  {}
  ngOnDestroy(): void {
    // this.wsService.subUnsubAll();
  }
  symbol: string;
  connectionStatus: string;
  // resultResp;
  //  swieczkiResp;
  // miniTickerResp;

  ngOnInit() {
    console.log('ekran:init');
    this.getSymbolID();
    this.kalkulacjeService.init();
    this.kalkulacjeService.setSymbol(this.symbol, 100, 40);
    //  this.wsService.getMsgSubject().subscribe(x => this.parseMsg(x));
    //  this.wsService.getConnectionSubject().subscribe(x => this.connectionStatus);
    // this.wsService.subscribe(this.symbol+"@kline_15m");
    // this.wsService.subscribe(this.symbol+"@kline_1m");
  }

  getSymbolID(): void {
    this.symbol = this.route.snapshot.paramMap.get('id');
  }
}
