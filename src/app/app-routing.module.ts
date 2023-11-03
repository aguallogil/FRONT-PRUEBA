import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginFormComponent, ResetPasswordFormComponent, CreateAccountFormComponent, ChangePasswordFormComponent } from './shared/components';
import { AuthGuardService } from './shared/services';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { TasksComponent } from './pages/tasks/tasks.component';
import { DxButtonModule, DxDataGridModule, DxDateBoxModule, DxFileUploaderModule, DxFormModule, DxNumberBoxModule, DxPopupModule, DxSelectBoxModule, DxTextBoxModule, DxToolbarModule } from 'devextreme-angular';
import { ClienteComponent } from './pages/components/cliente/cliente.component';
import { CommonModule } from '@angular/common';
import { CarritoComponent } from './pages/components/carrito/carrito.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CompraComponent } from './pages/components/compra/compra.component';
import { TipoClienteComponent } from './pages/components/tipo-cliente/tipo-cliente.component';
import { ProductoComponent } from './pages/components/producto/producto.component';
import { FacturaComponent } from './pages/components/factura/factura.component';

const routes: Routes = [
  {
    path: 'compra',
    component: CompraComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'carrito',
    component: CarritoComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'cliente',
    component: ClienteComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'producto',
    component: ProductoComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'tipo-cliente',
    component: TipoClienteComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'factura',
    component: FacturaComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'tasks',
    component: TasksComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [ AuthGuardService ],
    data:{roles:['home']}
  },
  {
    path: 'login-form',
    component: LoginFormComponent
  },
  {
    path: 'reset-password',
    component: ResetPasswordFormComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'create-account',
    component: CreateAccountFormComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'change-password/:recoveryCode',
    component: ChangePasswordFormComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true }), DxDataGridModule, DxFormModule,DxToolbarModule,DxPopupModule,DxDateBoxModule,
    DxTextBoxModule, DxButtonModule,DxNumberBoxModule,DxFileUploaderModule,CommonModule,DxSelectBoxModule,BrowserModule,FormsModule],
  providers: [AuthGuardService],
  exports: [RouterModule],
  declarations: [
    HomeComponent,
    ProfileComponent,
    TasksComponent,
    ClienteComponent,
    CarritoComponent,
    CompraComponent,
    TipoClienteComponent,
    ProductoComponent,
    FacturaComponent
  ]
})
export class AppRoutingModule { }
