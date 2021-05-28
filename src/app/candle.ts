// tslint:disable-next-line: class-name
export interface Candle {
  openTime: string; //  1591258320000,          // Open time
  open: string; //  "9640.7",               // Open
  high: string; //  "9642.4",               // High
  low: string; //  "9640.6",               // Low
  close: string; //  "9642.0",               // Close (or latest price)
  volume: string; //  "206",                  // Volume
  closeTime: string; //  1591258379999,          // Close time
  basseAssetVol: string; //  "2.13660389",           // Base asset volume
  numberOfTrades: string; //  48,                     // Number of trades
  takerBuyVolume: string; //  "119",                  // Taker buy volume
  takerBuyAssetVolume: string; //  "1.23424865",           // Taker buy base asset volume
  ignore: string; //  "0"                     // Ignore.
  /*public constructor(t: any) {
    console.log("praser");
    console.log(t);
    this.openTime = t[0];
    this.open = t[1];
  }*/
}
export interface KalkulacjeData {
  buyLvl: number; //poziom przy którym powinno być zlecenie buy liczony jako przekroczenie max kursu o x procent
  sellLvl: number; //poziom przy ktorym powinno byc zlecenie sell jako przekroczenie min kursu o x procent

  maxKurs: number; //maksymalna wartość kursu odczytana ze maxSwieczek
  minKurs: number; //minimalna wartość kursu odczytana ze świeczek

  kurs: number; // aktualny kurs
 
}
export interface KalkulacjeParametry{
marginesProcent:number;
cnt15min:number;
}
export interface KalkulacjeObjct{
  data: KalkulacjeData;
  parametry:KalkulacjeParametry;
}