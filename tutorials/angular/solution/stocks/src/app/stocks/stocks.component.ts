import { Component, OnInit } from '@angular/core';
import { Stock } from '../types';
import { DataService } from '../data.service';
import { Router } from '@angular/router';

@Component({
  templateUrl: './stocks.component.html'
})
export class StocksComponent implements OnInit {
  public stocks: Stock[] = [];

  constructor(private readonly data: DataService, private readonly router: Router) { }

  public async ngOnInit(): Promise<void> {
    this.stocks = await this.data.getStocks();
    this.data.onStockPrices()
      .subscribe((update) => {
        this.stocks.forEach((stock) => {
          const matchingStock = update.stocks.find((stockUpdate) => stockUpdate.RIC === stock.RIC);
          stock.Ask = matchingStock.Ask;
          stock.Bid = matchingStock.Bid;
        })
      });
  }

  public handleStockClick(stock: Stock): void {
    this.data.selectedStock = stock;
    this.router.navigate(['/details']);
  }
}
