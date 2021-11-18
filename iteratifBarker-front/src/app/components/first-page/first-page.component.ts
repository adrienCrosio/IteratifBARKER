import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective, Label } from 'ng2-charts';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-first-page',
  templateUrl: './first-page.component.html',
  styleUrls: ['./first-page.component.css']
})
export class FirstPageComponent implements OnInit, AfterViewInit {

  @ViewChild(BaseChartDirective, { static: false }) chart!: BaseChartDirective;

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
  barChartLabels: Label[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  barChartType: ChartType = "line";
  barChartLegend: boolean = true;
  barChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
  ];

  ngOnInit(): void {
    let cpt = 0;
    this.apiService.subTopic("status", (data) => {
      cpt++;
      console.log(cpt, data);
    })
  }

  ngAfterViewInit(): void {
    this.dynamicArrayHandle();
  }

  async dynamicArrayHandle() {
    while (true) {
      let max_cap_reached = false;
      if (this.barChartLabels.length > 10) {
        max_cap_reached = true;
        this.barChartLabels.shift();
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
