import { Component, OnInit } from '@angular/core';
import {AuthService, DefaultService, InfoService} from '@abilbaotm/freqtrade-client';
import {Bot} from '../../bot';
import {uuid4} from '@capacitor/core/dist/esm/util';
import {LocalStorageService} from 'ngx-localstorage';
import {Router} from '@angular/router';

@Component({
  selector: 'app-new-bot',
  templateUrl: './new-bot.page.html',
  styleUrls: ['./new-bot.page.scss'],
})
export class NewBotPage implements OnInit {
  formBaseUrl: string;
  testResult: string;
  formNote: string;
  formUsername: string;
  formPassword: string;
  allowSave = false;
  private newBot: Bot;

  constructor(private ping: DefaultService,private storageService: LocalStorageService, private infoService: InfoService, private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  testBot() {
    this.testResult = '';
    this.newBot = {id: uuid4(), basePath:this.formBaseUrl, note: this.formNote};

    this.ping.configuration.basePath = this.newBot.basePath;
    this.ping.pingApiV1PingGet().subscribe((result)=> {
      this.testResult = 'Connection response: ' + result.status;
    }, error => {alert(error.statusText); console.log(error);});

    this.authService.configuration.username = this.formUsername;
    this.authService.configuration.password = this.formPassword;

    this.authService.tokenLoginApiV1TokenLoginPost().subscribe((result) => {
      this.newBot.auth = {accessToken: result.access_token, refreshToken: result.refresh_token};


      this.authService.configuration.accessToken = result.access_token;
      this.infoService.versionApiV1VersionGet().subscribe((result) => {
        this.testResult += ' Bot version: ' + result.version;
        this.allowSave = true;
      }, error => {this.testResult+= ' Error getting version';});
    }, error => {this.testResult+= '. Bad credentials';});
    // do not store user/pass
    this.authService.configuration.username = undefined;
    this.authService.configuration.password = undefined;


  }

  saveBot(){
    // TODO: use safe storage
    let bots = this.storageService.get('bots');
    if (bots === undefined || bots === null) {
      bots = [];
    }

    bots.push(this.newBot);
    this.storageService.set('bots', bots);
    this.router.navigate(['/','bot', this.newBot.id]);
  }
}
