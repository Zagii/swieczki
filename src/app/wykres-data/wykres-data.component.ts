import {
  Component,
  Input,
  IterableDiffers,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { ECharts } from 'echarts';
import { consoleLog } from 'echarts/types/src/util/log';
import { Candle } from '../candle';
import { RestService } from '../rest.service';

@Component({
  selector: 'app-wykres-data',
  templateUrl: './wykres-data.component.html',
  styleUrls: ['./wykres-data.component.css']
})
export class WykresDataComponent implements OnInit, OnChanges {
  @Input() symbol: string;
  @Input() inputData: Candle[];
  @Input() interwal: string;
  differ: any;

  swieczki = [];
  dates = [];
  volumes = [];
  minKurs = Infinity;
  maxKurs = -Infinity;
  dataMA5 = []; //this.calculateMA(5, this.swieczki15m);
  dataMA10 = []; //this.calculateMA(10, this.swieczki15m);
  dataMA20 = []; //this.calculateMA(20, this.swieczki15m);
  aktualnyKurs = 1;

  echartsIntance: ECharts;

  constructor(
    private rest: RestService,
    private iterableDiffers: IterableDiffers
  ) {
    this.differ = iterableDiffers.find([]).create(null);
  }
  onChartInit(ec): void {
    console.log('ChartInit');
    this.echartsIntance = ec;
    //  this.echartsIntance.resize({
    //  height: 1000
    // });
    // console.log(ec);
    //  setTimeout((() => { this.aktualizujDane(); }), 2000);
    // this.aktualizujDane();
  }
  ngDoCheck(): void {
    let changes = this.differ.diff(this.inputData);
    if (changes) {
      // console.log('Changes detected!');
      this.calcData();
    }
  }
  public calcData(): void {
    // console.log('calcData')
    if (!this.inputData || this.inputData.length < 0) return;
    //this.minKurs = Infinity;
    //this.maxKurs = -Infinity;

    this.swieczki = this.rest.calculateData(this.inputData);
    //  swieczki1m = [];
    this.dates = this.rest.calculateDates(this.inputData);
    this.volumes = this.rest.calculateVolumes(this.inputData);

    this.dataMA5 = this.rest.calculateMA(5, this.swieczki);
    this.dataMA10 = this.rest.calculateMA(10, this.swieczki);
    this.dataMA20 = this.rest.calculateMA(20, this.swieczki);
    this.aktualnyKurs = 1;
    this.aktualizujDane();
  }

  ngOnChanges(changes: SimpleChanges): void {
    //console.log("onChanges wykres-data")
    this.calcData();
  }

  ngOnInit() {
    this.chartOption.title.text = 'Wykres ' + this.symbol;
    this.aktualizujDane();
  }
  aktualizujDane(): void {
    //  if (this.krokiTab === undefined) { return; }
    if (this.echartsIntance === undefined) {
      return;
    }

    let opt = this.echartsIntance.getOption();
    //console.log(this.dataMA10);
    opt.xAxis[0].data = this.dates;
    opt.series[0].data = this.volumes;
    opt.series[1].data = this.swieczki;
    opt.series[2].data = this.dataMA5;
    opt.series[3].data = this.dataMA10;
    opt.series[4].data = this.dataMA20;
    this.echartsIntance.setOption(opt);
    //   console.log(this.echartsIntance.getOption().series);
  }
  colorList = [
    '#c23531',
    '#2f4554',
    '#61a0a8',
    '#d48265',
    '#91c7ae',
    '#749f83',
    '#ca8622',
    '#bda29a',
    '#6e7074',
    '#546570',
    '#c4ccd3'
  ];

  labelFont = 'bold 12px Sans-serif';
  chartOption = {
    animation: false,
    color: this.colorList,
    title: {
      left: 'center',
      text: ''
    },
    legend: {
      top: 30,
      data: ['kurs', 'MA5', 'MA10', 'MA20']
    },
    tooltip: {
      // triggerOn: 'none',
      transitionDuration: 0,
      confine: true,
      bordeRadius: 4,
      borderWidth: 1,
      borderColor: '#333',
      backgroundColor: 'rgba(255,255,255,0.9)',
      textStyle: {
        fontSize: 12,
        color: '#333'
      },
      position: function(pos, params, el, elRect, size) {
        var obj = {
          top: 10
        };
        // console.log(pos);
        obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
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
        type: 'slider',
        xAxisIndex: [0, 1],
        realtime: false,
        //  start: 20,
        // end: 70,
        top: 65,
        height: 20,
        handleIcon:
          'path://M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        handleSize: '120%'
      },
      {
        type: 'inside',
        xAxisIndex: [0, 1],
        start: 40,
        end: 70,
        top: 30,
        height: 20
      }
    ],
    xAxis: [
      {
        type: 'category',
        data: this.dates,
        boundaryGap: false,
        axisLine: { lineStyle: { color: '#777' } },
        axisLabel: {
          // formatter: function(value) {
          //  return echarts.format.formatTime("MM-dd", value);
          // return echarts.time.format()
          // }
          formatter: {
            millisecond: '{hh}:{mm}:{ss} {SSS}'
          }
        },
        min: 'dataMin',
        max: 'dataMax',
        axisPointer: {
          show: true
        }
      },
      {
        type: 'category',
        gridIndex: 1,
        data: this.dates,
        scale: true,
        boundaryGap: false,
        splitLine: { show: false },
        axisLabel: { show: false },
        axisTick: { show: false },
        axisLine: { lineStyle: { color: '#777' } },
        splitNumber: 20,
        min: 'dataMin',
        max: 'dataMax',
        axisPointer: {
          type: 'shadow',
          label: { show: false },
          triggerTooltip: true,
          handle: {
            show: true,
            margin: 30,
            color: '#B80C00'
          }
        }
      }
    ],
    yAxis: [
      {
        scale: true,
        splitNumber: 2,
        axisLine: { lineStyle: { color: '#777' } },
        splitLine: { show: true },
        axisTick: { show: false },
        boundaryGap: ['5%', '5%'],
        axisLabel: {
          inside: true,
          formatter: '{value}\n'
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
        type: 'group',
        left: 'center',
        top: 70,
        width: 300,
        bounding: 'raw',
        children: [
          {
            id: 'MA5',
            type: 'text',
            style: { fill: this.colorList[1], font: this.labelFont },
            left: 0
          },
          {
            id: 'MA10',
            type: 'text',
            style: { fill: this.colorList[2], font: this.labelFont },
            left: 'center'
          },
          {
            id: 'MA20',
            type: 'text',
            style: { fill: this.colorList[3], font: this.labelFont },
            right: 0
          }
        ]
      }
    ],
    series: [
      {
        name: 'Volume',
        type: 'bar',
        xAxisIndex: 1,
        yAxisIndex: 1,
        itemStyle: {
          color: '#7fbe9e'
        },
        emphasis: {
          itemStyle: {
            color: '#140'
          }
        },
        data: this.volumes
      },
      {
        type: 'candlestick',
        name: 'kurs',
        data: this.swieczki,
        itemStyle: {
          color: '#14b143',
          color0: '#ef232a',
          borderColor: '#ef232a',
          borderColor0: '#14b143'
        },
        emphasis: {
          itemStyle: {
            color: 'black',
            color0: '#444',
            borderColor: 'black',
            borderColor0: '#444'
          }
        }
      },
      {
        name: 'MA5',
        type: 'line',
        data: this.dataMA5,
        smooth: true,
        showSymbol: false,
        lineStyle: {
          width: 1
        }
      },
      {
        name: 'MA10',
        type: 'line',
        data: this.dataMA10,
        smooth: true,
        showSymbol: false,
        lineStyle: {
          width: 1
        }
      },
      {
        name: 'MA20',
        type: 'line',
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
