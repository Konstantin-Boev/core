import { Component, OnInit } from "@angular/core";
import { DataService } from '../data.service';
import { Stock } from '../types';

@Component({
    templateUrl: './stock-details.component.html'
})
export class StockDetailsComponent implements OnInit {

    public stock: Stock;

    constructor(private readonly dataService: DataService) { }

    public ngOnInit(): void {
        this.stock = this.dataService.selectedStock;
    }

}