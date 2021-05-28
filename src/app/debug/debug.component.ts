import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { RestService } from ".././rest.service";

@Component({
  selector: "app-debug",
  templateUrl: "./debug.component.html",
  styleUrls: ["./debug.component.css"]
})
export class DebugComponent implements OnInit {
  constructor(private restService: RestService) {}
  serverTime: Object;
  ngOnInit() {this.getServerTime();}
  getServerTime() {
   // this.restService.getServerTime().subscribe(serverTime => {
      this.restService.get('time').subscribe(serverTime => {
      //console.log(serverTime);
      this.serverTime = serverTime["serverTime"];
    });
  }
}
