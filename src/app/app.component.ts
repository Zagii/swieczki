import { Component, OnInit, OnDestroy } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { WebSocketSubject } from "rxjs/observable/dom/WebSocketSubject";
import { webSocket } from "rxjs/webSocket";
import { retry } from "rxjs/operators";
import { WsServiceService } from "./ws-service.service";
import { ChatService } from "./chat.service";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit, OnDestroy {
  //private socket: WebSocketSubject;
  //host = "wss://dstream.binancefuture.com";
  host = "wss://echo.websocket.org/";
  id = 0;
  //host = "wss://stream.binance.com:9443/ws/bnbusdt@depth@1000ms";
  constructor(private wsService: WsServiceService) {
    //  this.socket = new WebSocketSubject(host);
    // console.log(this.socket);
    /*  this.socket = new WebSocket(host);
    this.socket.onmessage = e => {
      console.log(e.data);
    };

    this.socket.onopen = e => {
      console.log("socket open :");
      console.log(e);
    };

    this.socket.onclose = e => {
      console.log("socket close :");
      console.log(e);
    };

    this.socket.onerror = e => {
      console.log("socket error :");
      console.log(e);
    };
    */
  }

  ngOnDestroy() {
    //this.socket.close();
    this.wsService.destroy();
  }

  ngOnInit() {
    /*this.wsService.connect(this.host).map(
      (response: any): any => {
        console.log(response);
        return response;
      }
    );*/
    this.wsService.init(false);
    //this.wsService.subscribe( "btcusdt@aggTrade");
    // this.wsService.unsubscribe("btcusdt@aggTrade");
  }
  sendMsg(msg) {
    msg = msg + " " + this.id;
    this.id++;
    console.log("new message from client to websocket: ", msg);

    this.wsService.send(msg);
  }
}
