import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DxFormModule } from 'devextreme-angular/ui/form';
import { DxLoadIndicatorModule } from 'devextreme-angular/ui/load-indicator';
import { Usuario } from '../../models/usuario.model';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../../services/authentication.service';


@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit{
  loading = false;
  formData: any = {};
  error = '';
  returnUrl: string;

  constructor(private authService: AuthenticationService,private route: ActivatedRoute, private router: Router) { }
  ngOnInit() {
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '';
  }
  async onSubmit(e: Event) {
    e.preventDefault();
    const { usuario, password,sucursal } = this.formData;
    this.loading = true;
    let user=new Usuario();
    user.de_Usuario=usuario;
    user.de_Password=password;
    this.authService.login(user)
        .pipe(first())
        .subscribe(
          data => {
              if (this.returnUrl.length < 2) //si solo es la diagonal /
                this.router.navigate(['/home']);
              else
                this.router.navigateByUrl(this.returnUrl);//ir a la ruta en la que estaba antes de volver a iniciar sesión
          },
          error => {
            this.error = error;
            this.loading = false;
          });
  }

  onCreateAccountClick = () => {
    this.router.navigate(['/create-account']);
  }
}
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    DxFormModule,
    DxLoadIndicatorModule
  ],
  declarations: [ LoginFormComponent ],
  exports: [ LoginFormComponent ]
})
export class LoginFormModule { }
