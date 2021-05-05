import { Component } from '@angular/core';
import {AuthService, InfoService} from '@abilbaotm/freqtrade-client';
import {LocalStorageService} from 'ngx-localstorage';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  result: string;

  constructor(private storageService: LocalStorageService, private infoService: InfoService, private authService: AuthService) {}

  testConn() {
    this.infoService.balanceApiV1BalanceGet().subscribe((result) => {
      this.result = JSON.stringify(result);
    }, error => {this.result = 'Error: ' + JSON.stringify(error);});
  }

  login() {
    this.storageService.remove('access_token');
    this.storageService.remove('refresh_token');

    this.authService.configuration.username = 'asier';
    this.authService.configuration.password = 'asier';
    this.authService.tokenLoginApiV1TokenLoginPost().subscribe((result) => {
      this.storageService.set('access_token',result.access_token);
      this.storageService.set('refresh_token',result.refresh_token);
      // TODO: Deprecated
      this.authService.configuration.accessToken = result.access_token;
    });
    this.authService.configuration.username = undefined;
    this.authService.configuration.password = undefined;
  }
}
