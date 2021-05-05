import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewBotPage } from './new-bot.page';

const routes: Routes = [
  {
    path: '',
    component: NewBotPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewBotPageRoutingModule {}
