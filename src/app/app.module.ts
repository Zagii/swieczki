import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";
import { HelloComponent } from "./hello.component";
import { ChatService } from "./chat.service";
import { WsServiceService } from "./ws-service.service";
import { PairDataComponent } from "./pair-data/pair-data.component";
import { RestService } from "./rest.service";
import { HttpClientModule } from "@angular/common/http";
import { DebugComponent } from "./debug/debug.component";
import { EkranStartComponent } from "./ekran-start/ekran-start.component";
import { Routes, RouterModule } from "@angular/router";
import ekranStartComponentCss from "./ekran-start/ekran-start.component.css";
import { ParaComponent } from "./para/para.component";
import { EkranParaComponent } from "./ekran-para/ekran-para.component";
import { WykresComponent } from "./wykres/wykres.component";
import { NgxEchartsModule } from "ngx-echarts";

import * as echarts from "echarts";
import { Wykres1minComponent } from "./wykres1min/wykres1min.component";
import { EkranDebugComponent } from "./ekran-debug/ekran-debug.component";
import { KalkulacjeService } from './kalkulacje.service';
import { WykresDataComponent } from './wykres-data/wykres-data.component';
import { EkranAutomatComponent } from './ekran-automat/ekran-automat.component';

const routes: Routes = [
  { path: "home", component: EkranStartComponent },
  { path: "para/:id", component: EkranParaComponent },
  { path: "debug/:id", component: EkranDebugComponent },
  { path: "automat/:id", component: EkranAutomatComponent },
  { path: "", redirectTo: "/home", pathMatch: "full" },
  { path: "**", redirectTo: "/home" }
];

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes, { useHash: true }),
    NgxEchartsModule.forRoot({
      echarts: () => import("echarts")
    })
  ],
  declarations: [
    AppComponent,
    HelloComponent,
    PairDataComponent,
    DebugComponent,
    EkranStartComponent,
    ParaComponent,
    EkranParaComponent,
    WykresComponent,
    Wykres1minComponent,
    EkranDebugComponent,
    WykresDataComponent,
    EkranAutomatComponent
  ],
  bootstrap: [AppComponent],
  providers: [ChatService, WsServiceService, RestService, KalkulacjeService]
})
export class AppModule {}
