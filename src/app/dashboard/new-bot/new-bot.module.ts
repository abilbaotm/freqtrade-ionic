import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewBotPageRoutingModule } from './new-bot-routing.module';

import { NewBotPage } from './new-bot.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewBotPageRoutingModule
  ],
  declarations: [NewBotPage]
})
export class NewBotPageModule {}
