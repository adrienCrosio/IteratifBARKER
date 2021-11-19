import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective, Label } from 'ng2-charts';
import { ApiService } from 'src/app/services/api/api.service';
import { WebSocketDataCurrentPrice } from "../../../../../interface/websocket_interface_data"

@Component({
  selector: 'app-first-page',
  templateUrl: './first-page.component.html',
  styleUrls: ['./first-page.component.css']
})
export class FirstPageComponent implements OnInit, AfterViewInit {

  @ViewChild(BaseChartDirective, { static: false }) chart!: BaseChartDirective;

  duration = 15 * 60 * 1000;
  constructor(private apiService: ApiService) { }

  barChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Chart.js Line Chart'
      }
    }
  };
  barChartLabels: Label[] = [];
  barChartType: ChartType = "line";
  barChartLegend: boolean = true;
  barChartData: ChartDataSets[] = [
    { data: [], label: 'Current Price' }
  ];

  ngOnInit(): void {
    this.apiService.subTopic("currentPrice", (data) => {
      if (data.event === "sub") {
        //init
        let curentPrice: WebSocketDataCurrentPrice[] = data.data;
        this.barChartData[0].data = curentPrice.map(x => x.value);
        this.barChartLabels = curentPrice.map(x => new Date(x.time).toISOString());
      }
      else {
        //append
        let curentPrice: WebSocketDataCurrentPrice = data.data;
        this.barChartData[0].data?.push(curentPrice.value);
        let cpt_shift = 0;
        //@ts-ignore
        this.barChartLabels.filter(timeISO => {
          //@ts-ignore
          let bool = new Date(timeISO).getTime() > (curentPrice.time - this.duration);
          if (bool === false) {
            cpt_shift++;
          }
          return bool;
        });
        let date = new Date(curentPrice.time);
        this.barChartLabels.push(date.toISOString());
        this.shift(cpt_shift);
      }
    })
  }

  ngAfterViewInit(): void {
    // this.dynamicArrayHandle();
  }

  shift(cpt: number) {
    for (let index = 0; index < cpt; index++) {
      this.barChartLabels.shift();
      for (const data of this.barChartData) {
        data.data?.shift();
      }
    }
  }

  async dynamicArrayHandle() {
    while (true) {
      let max_cap_reached = false;
      if (this.barChartLabels.length > 10) {
        max_cap_reached = true;
      }
      for (const data of this.barChartData) {
        let randomNumber = Math.floor(Math.random() * 100);
        data.data?.push(randomNumber);
        if (max_cap_reached) {
          data.data?.shift();
        }
      }
      let prevLabel = parseInt('' + this.barChartLabels[this.barChartLabels.length - 1]);
      this.barChartLabels.push((prevLabel + 1).toString());
      this.chart.update();
      await this.sleep(1500);
    }
  }

  async sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

}
