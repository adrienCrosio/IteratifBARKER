import { Component, OnInit } from '@angular/core';
import { multiChartOption } from 'src/app/interface/multi-aligned-chart';
@Component({
  selector: 'app-first-page',
  templateUrl: './first-page.component.html',
  styleUrls: ['./first-page.component.css']
})
export class FirstPageComponent implements OnInit {
  multiChartOption: multiChartOption[] = [{ label: 'Current Price', websocket_topic: 'currentPrice' }, { label: "MACD Value", websocket_topic: "macdValues" }];
  ngOnInit(): void {
  }

}
