import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SimulatorsEComponent } from './simulators-e/simulators-e.component';
import { SimulatorsComponent } from './simulators/simulators.component';


const routes:Routes =
[{ path: 'educativo', component:SimulatorsEComponent},
// {path:'simuladores',component:SimulatorsComponent}
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
