import { Component, OnInit } from '@angular/core';
import { DataService } from './data.service';
import { Client } from './types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public clients: Client[] = [];

  constructor(private readonly data: DataService) { }

  public async ngOnInit(): Promise<void> {
    this.clients = await this.data.getClients();
  }

  public handleClientClick(client: Client): void {
    console.log(client);
  }
}
