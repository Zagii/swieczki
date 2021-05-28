import { Component, Input, OnInit } from '@angular/core';
import * as echarts from "echarts";
import { ECharts } from "echarts";
import { Observable } from 'rxjs';
import { Candle } from '../Candle';
import { RestService } from '../rest.service';

@Component({
  selector: 'app-wykres1min',
  templateUrl: './wykres1min.component.html',
  styleUrls: ['./wykres1min.component.css']
})
export class Wykres1minComponent implements OnInit {
  
  dataTab1m: Candle[];
  candleTab1m: Candle[];
   private candleSubs: Observable<Candle[]>;
  @Input() symbol: string;
  echartsIntance: ECharts;
  constructor(private restService: RestService) {}
  swieczki1m = [];
  dates1m = [];
  ngOnInit() {
    this.chartOption.title.text = "Wykres [1m]" + this.symbol;
    this.candleSubs = this.restService.getCandleData(this.symbol, "1m", "15");
    this.candleSubs.subscribe((val: Candle[]) => {
      this.dataTab1m = val;
      this.dataTab1m = this.dataTab1m.map(x => this.restService.mapCandle(x));
      this.aktualizujDane();
    }); 
  }
    onChartInit(ec): void {
    console.log("ChartInit");
    this.echartsIntance = ec;
    // console.log(ec);
    //  setTimeout((() => { this.aktualizujDane(); }), 2000);
    // this.aktualizujDane();
  }
 aktualizujDane(): void {
    //  if (this.krokiTab === undefined) { return; }
    if (this.echartsIntance === undefined) {
      return;
    }
    if (this.dataTab1m.length <= 0) return;
    // console.log(this.dataTab15m);

    this.dates1m = this.restService.calculateDates(this.dataTab1m);

    this.swieczki1m = this.restService.calculateData(this.dataTab1m);

    let opt = this.echartsIntance.getOption();
    //console.log(this.dataMA10);
    opt.xAxis[0].data = this.dates1m;
    opt.series[0].data = this.swieczki1m;
    this.echartsIntance.setOption(opt);
    //   console.log(this.echartsIntance.getOption().series);
  }
chartOption  = {
  title: {
      left: "center",
      text: ""
    },
    xAxis: {
        data: []
    },
    yAxis: {scale:true},
    series: [{
        type: 'k',
        data: [ ]
    }]
};
}