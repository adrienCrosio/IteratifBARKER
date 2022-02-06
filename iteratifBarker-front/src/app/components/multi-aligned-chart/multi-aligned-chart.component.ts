import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective, Label } from 'ng2-charts';
import { multiChartOption } from 'src/app/interface/multi-aligned-chart';
import { ApiService } from 'src/app/services/api/api.service';
import { WebSocketDataCurrentPrice } from '../../../../../interface/websocket_interface_data';

@Component({
  selector: 'app-multi-aligned-chart',
  templateUrl: './multi-aligned-chart.component.html',
  styleUrls: ['./multi-aligned-chart.component.css']
})
export class MultiAlignedChartComponent implements OnInit, OnChanges {

  @ViewChild(BaseChartDirective, { static: false }) chart!: BaseChartDirective;

  duration = 15 * 60 * 1000;
  constructor(private apiService: ApiService) { }

  @Input() multiChartOption: multiChartOption[] = [];

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
  barChartData: ChartDataSets[] = [];

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.multiChartOption) {
      this.barChartData = [];
      for (const value of this.multiChartOption) {
        this.barChartData.push({ data: [], label: value.label });
        this.subCoordinatedTopic(value.websocket_topic);
      }
    }
  }

  // return the index of the label
  addCoordinatedLabel(time: number): number {
    let index = this.barChartLabels.findIndex(x => new Date(x.toString()).getTime() === time)
    if (index === -1) {
      index = 0;
      console.log("dont exist")
      for (index = 0; index < this.barChartLabels.length; index++) {
        const value = this.barChartLabels[index];
        let date = new Date(value.toString()).getTime();
        if (date > time) {
          this.barChartLabels.splice(index, 0, new Date(time).toISOString());
          for (const value of this.barChartData) {
            let default_value = 0;
            try {
              let b_value = value.data[index] as number;
              default_value = b_value;
              let a_value = value.data[index - 1] as number;
              default_value = (a_value + b_value) / 2;
            } catch (error) {
              console.log(`went wrong lol, default_value: ${default_value}`);
            }
            value.data.splice(index, 0, default_value);
          }
        }
      }
    }
    return index;
  }

  subCoordinatedTopic(topic: string) {
    this.apiService.subTopic(topic, (data) => {
      let index = this.multiChartOption.findIndex(x => x.websocket_topic === topic);
      let currentBarChartData = this.barChartData[index];
      if (data.event === "sub") {
        //init
        let curentPrice: WebSocketDataCurrentPrice[] = data.data;
        currentBarChartData.data = curentPrice.map(x => x.value);
        if (this.barChartLabels.length === 0) {
          this.barChartLabels = curentPrice.map(x => new Date(x.time).toISOString());
        }
        else {
          for (const value of curentPrice) {
            const index = this.addCoordinatedLabel(value.time);
          }
          const diff_length = this.barChartLabels.length - currentBarChartData.data.length;
          if (diff_length > 0) {
            for (let index = 0; index < diff_length; index++) {
              currentBarChartData.data.splice(0, 0, 0);
            }
          } else if (diff_length === 0) {
            console.log("Do nothing it is perfect");
          } else {
            console.log("I don t know what to do yet");
          }
        }
      }
      else {
        //append
        let curentPrice: WebSocketDataCurrentPrice = data.data;
        currentBarChartData.data?.push(curentPrice.value);
        let cpt_shift = 0;
        this.barChartLabels.filter(timeISO => {
          let bool = new Date(timeISO as string).getTime() > (curentPrice.time - this.duration);
          if (bool === false) {
            cpt_shift++;
          }
          return bool;
        });
        let date = new Date(curentPrice.time);
        this.barChartLabels.push(date.toISOString());
        this.shift(cpt_shift);
      }
      this.barChartData[index] = currentBarChartData;
    })
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
