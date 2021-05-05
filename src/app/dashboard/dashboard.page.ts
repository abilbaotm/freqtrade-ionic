import { Component, OnInit } from '@angular/core';
import {LocalStorageService} from 'ngx-localstorage';
import {uuid4} from '@capacitor/core/dist/esm/util';
import {ModalController} from '@ionic/angular';
import {Router} from '@angular/router';
import {Bot} from '../bot';
import {AuthService, DefaultService, InfoService} from '@abilbaotm/freqtrade-client';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  bots: Bot[] = [];
  jwtHelper = new JwtHelperService();

  constructor(private storageService: LocalStorageService, private router: Router, private ping: DefaultService,
              private infoService: InfoService, private authService: AuthService) { }

  ngOnInit() {
    this.bots = this.storageService.get('bots');
    if (this.bots === undefined || this.bots === null) {
      this.bots = [];
    }

    // setInterval(()=> { this.updateData(); }, 3 * 1000);
    this.updateData();

  }
  createBot() {
    this.router.navigate(['new-bot']);
  }
  requestData(bot) {
    this.authService.configuration.accessToken = bot.auth.accessToken;
    this.ping.pingApiV1PingGet().subscribe(()=> {
      bot.status.ping = true;
    }, error => {bot.status.ping = false;});
    this.infoService.balanceApiV1BalanceGet().subscribe((balances) => {
      console.log('hgo');
      bot.status.balances = balances;
    }, error => {console.log(error);});
    this.infoService.countApiV1CountGet().subscribe((trades)=>{
      bot.status.count = trades;
    });
    this.infoService.versionApiV1VersionGet().subscribe((version)=>{
      bot.status.version = version;
    });
  }
  updateData(){
    this.bots.forEach((bot)=> {
      if (bot.status === undefined) {
        bot.status = {ping:false};
      }

      if (bot.auth !== undefined && bot.auth.accessToken !== undefined){
        // check token expiered
        if (this.jwtHelper.isTokenExpired(bot.auth.accessToken)) {
          console.log('expired');
          this.authService.configuration.accessToken = bot.auth.refreshToken;
          this.authService.tokenRefreshApiV1TokenRefreshPost().subscribe((newAccessToken)=> {
            bot.auth.accessToken = newAccessToken.access_token;
            this.requestData(bot);
          },error => {console.warn('ERROR refreshing token'); this.ping.configuration.accessToken = '';});
        } else {
          console.log('ok');
          this.requestData(bot);
        }


      }

    });
  }

}
