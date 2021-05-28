import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { RestService } from ".././rest.service";

@Component({
  selector: "app-pair-data",
  templateUrl: "./pair-data.component.html",
  styleUrls: ["./pair-data.component.css"]
})
export class PairDataComponent implements OnInit {
  constructor(private restService: RestService) {}

  pary: Object[];
  ngOnInit() {
    this.getPair();
  }
  getPair() {
    this.restService.get("exchangeInfo").subscribe(resp => {
      console.log(resp["symbols"][0]);
      this.pary = resp["symbols"].filter(x=>x["quoteAsset"]==='USDT'); //
      this.pary = this.pary.sort(
         (a,b) => 0 - (a["symbol"] > b["symbol"] ? -1 : 1)
      );
   
      //["serverTime"];
      
    });
  }

}
