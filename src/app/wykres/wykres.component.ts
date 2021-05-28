import {
  AfterContentInit,
  AfterViewInit,
  Component,
  Input,
  OnInit
} from "@angular/core";
import * as echarts from "echarts";
import { ECharts } from "echarts";
import { NgxEchartsModule } from "ngx-echarts";
import { BehaviorSubject } from "rxjs";
import { Observable } from "rxjs/Observable";
import { Candle } from "../candle";
import { RestService } from "../rest.service";

@Component({
  selector: "app-wykres",
  templateUrl: "./wykres.component.html",
  styleUrls: ["./wykres.component.css"]
})
export class WykresComponent implements OnInit {
  dataTab15m: Candle[];
  candleTab: Candle[];
  //@Input() dataTabObs: Observable<Candle[]>;
  private candleSubs: Observable<Candle[]>;
  @Input() symbol: string;
  echartsIntance: ECharts;
  constructor(private restService: RestService) {}
  swieczki15m = [];
  //  swieczki1m = [];
  dates15m = [];
  volumes15m = [];
  minKurs = Infinity;
  maxKurs = -Infinity;
  dataMA5 = []; //this.calculateMA(5, this.swieczki15m);
  dataMA10 = []; //this.calculateMA(10, this.swieczki15m);
  dataMA20 = []; //this.calculateMA(20, this.swieczki15m);
  aktualnyKurs = 1;
  ngOnInit() {
    this.chartOption.title.text = "Wykres " + this.symbol;
    this.candleSubs = this.restService.getCandleData(this.symbol, "15m", "100");
    this.candleSubs.subscribe((val: Candle[]) => {
      this.dataTab15m = val;
      this.dataTab15m = this.dataTab15m.map(x => this.restService.mapCandle(x));
      this.aktualizujDane();
    }); 
    //   setInterval(() => {
    // this.restService.getCandleData(this.symbol, "15m", "100")
    //  }, 5000);
    //console.log("wykres:init.subscr data");
  }
  btnClick()
  {
    this.restService.getCandleData(this.symbol, "15m", "100").subscribe((val: Candle[]) => {
      this.dataTab15m = val;
      this.dataTab15m = this.dataTab15m.map(x => this.restService.mapCandle(x));
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
    if (this.dataTab15m.length <= 0) return;
    // console.log(this.dataTab15m);

    this.maxKurs = this.restService.maxKurs(this.dataTab15m);
    this.minKurs = this.restService.minKurs(this.dataTab15m);
    console.log(
      "aktualizacja danych: " + this.dataTab15m.length + ", " + this.maxKurs
    );
    this.dates15m = this.restService.calculateDates(this.dataTab15m);
    this.volumes15m = this.restService.calculateVolumes(this.dataTab15m);
    this.swieczki15m = this.restService.calculateData(this.dataTab15m);
    //  this.swieczki1m = this.restService.calculateData(this.dataTab1m);
    this.dataMA5 = this.restService.calculateMA(5, this.swieczki15m);

    this.dataMA10 = this.restService.calculateMA(10, this.swieczki15m);
    this.dataMA20 = this.restService.calculateMA(20, this.swieczki15m);
    let opt = this.echartsIntance.getOption();
    //console.log(this.dataMA10);
    opt.xAxis[0].data = this.dates15m;
    opt.series[0].data = this.volumes15m;
    opt.series[1].data = this.swieczki15m;
    opt.series[2].data = this.dataMA5;
    opt.series[3].data = this.dataMA10;
    opt.series[4].data = this.dataMA20;
    this.echartsIntance.setOption(opt);
    //   console.log(this.echartsIntance.getOption().series);
  }

  colorList = [
    "#c23531",
    "#2f4554",
    "#61a0a8",
    "#d48265",
    "#91c7ae",
    "#749f83",
    "#ca8622",
    "#bda29a",
    "#6e7074",
    "#546570",
    "#c4ccd3"
  ];
  labelFont = "bold 12px Sans-serif";
  chartOption = {
    animation: false,
    color: this.colorList,
    title: {
      left: "center",
      text: ""
    },
    legend: {
      top: 30,
      data: ["kurs15m", "MA5", "MA10", "MA20"]
    },
    tooltip: {
      triggerOn: "none",
      transitionDuration: 0,
      confine: true,
      bordeRadius: 4,
      borderWidth: 1,
      borderColor: "#333",
      backgroundColor: "rgba(255,255,255,0.9)",
      textStyle: {
        fontSize: 12,
        color: "#333"
      },
      position: function(pos, params, el, elRect, size) {
        var obj = {
          top: 10
        };
     //   console.log(pos);
        obj[["left", "right"][+(pos[0] < size.viewSize[0] / 2)]] = 5;
        return obj;
      }
    },
    axisPointer: {
      link: [
        {
          xAxisIndex: [0, 1]
        }
      ]
    },
    dataZoom: [
      {
        type: "slider",
        xAxisIndex: [0, 1],
        realtime: false,
      //  start: 20,
       // end: 70,
        top: 65,
        height: 20,
        handleIcon:
          "path://M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
        handleSize: "120%"
      },
      {
        type: "inside",
        xAxisIndex: [0, 1],
        start: 40,
        end: 70,
        top: 30,
        height: 20
      }
    ],
    xAxis: [
      {
        type: "category",
        data: this.dates15m,
        boundaryGap: false,
        axisLine: { lineStyle: { color: "#777" } },
        axisLabel: {
          // formatter: function(value) {
          //  return echarts.format.formatTime("MM-dd", value);
          // return echarts.time.format()
          // }
          formatter: {
            millisecond: "{hh}:{mm}:{ss} {SSS}"
          }
        },
        min: "dataMin",
        max: "dataMax",
        axisPointer: {
          show: true
        }
      },
      {
        type: "category",
        gridIndex: 1,
        data: this.dates15m,
        scale: true,
        boundaryGap: false,
        splitLine: { show: false },
        axisLabel: { show: false },
        axisTick: { show: false },
        axisLine: { lineStyle: { color: "#777" } },
        splitNumber: 20,
        min: "dataMin",
        max: "dataMax",
        axisPointer: {
          type: "shadow",
          label: { show: false },
          triggerTooltip: true,
          handle: {
            show: true,
            margin: 30,
            color: "#B80C00"
          }
        }
      }
    ],
    yAxis: [
      {
        scale: true,
        splitNumber: 2,
        axisLine: { lineStyle: { color: "#777" } },
        splitLine: { show: true },
        axisTick: { show: false },
        boundaryGap: ["5%", "5%"],
        axisLabel: {
          inside: true,
          formatter: "{value}\n"
        }
      },
      {
        scale: true,
        gridIndex: 1,
        splitNumber: 2,
        axisLabel: { show: false },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: false }
      }
    ],
    grid: [
      {
        left: 20,
        right: 20,
        top: 110,
        height: 150
      },
      {
        left: 20,
        right: 20,
        height: 40,
        top: 260
      }
    ],
    graphic: [
      {
        type: "group",
        left: "center",
        top: 70,
        width: 300,
        bounding: "raw",
        children: [
          {
            id: "MA5",
            type: "text",
            style: { fill: this.colorList[1], font: this.labelFont },
            left: 0
          },
          {
            id: "MA10",
            type: "text",
            style: { fill: this.colorList[2], font: this.labelFont },
            left: "center"
          },
          {
            id: "MA20",
            type: "text",
            style: { fill: this.colorList[3], font: this.labelFont },
            right: 0
          }
        ]
      }
    ],
    series: [
      {
        name: "Volume",
        type: "bar",
        xAxisIndex: 1,
        yAxisIndex: 1,
        itemStyle: {
          color: "#7fbe9e"
        },
        emphasis: {
          itemStyle: {
            color: "#140"
          }
        },
        data: this.volumes15m
      },
      {
        type: "candlestick",
        name: "kurs15m",
        data: this.swieczki15m,
        itemStyle: {
          color: "#ef232a",
          color0: "#14b143",
          borderColor: "#ef232a",
          borderColor0: "#14b143"
        },
        emphasis: {
          itemStyle: {
            color: "black",
            color0: "#444",
            borderColor: "black",
            borderColor0: "#444"
          }
        }
      },
      {
        name: "MA5",
        type: "line",
        data: this.dataMA5,
        smooth: true,
        showSymbol: false,
        lineStyle: {
          width: 1
        }
      },
      {
        name: "MA10",
        type: "line",
        data: this.dataMA10,
        smooth: true,
        showSymbol: false,
        lineStyle: {
          width: 1
        }
      },
      {
        name: "MA20",
        type: "line",
        data: this.dataMA20,
        smooth: true,
        showSymbol: false,
        lineStyle: {
          width: 1
        }
      }
    ]
  };
}
