import { Component, OnInit } from '@angular/core';
import { TipoCliente } from '../models/tipocliente.model';
import { Router } from '@angular/router';
import { TipoClienteService } from '../services/tipocliente.service';
import { alert, confirm } from 'devextreme/ui/dialog';

@Component({
  selector: 'app-tipo-cliente',
  templateUrl: './tipo-cliente.component.html',
  styleUrls: ['./tipo-cliente.component.scss']
})
export class TipoClienteComponent implements OnInit{
  tipoCliente: TipoCliente;
  popupNuevoVisible: boolean = false;
  isLoadPanelVisible: boolean = false;
  datos: any;
  popupNuevo: boolean;
  backButtonOptions: any;
  refreshButtonOptions: any;
  newOptions: any;
  currentFilter: any;

  constructor(public router: Router, private tipoClienteService: TipoClienteService) {
    this.backButtonOptions = {
      type: 'back',
      onClick: () => {
        this.router.navigate(['/home']);
      }
    };
    this.refreshButtonOptions = {
      icon: 'refresh',
      onClick: () => {
        this.reload('tipocliente');
      }
    };
    this.newOptions = {
      icon: 'add',
      text: 'Nuevo',
      type: 'default',
      stylingMode: 'text',
      onClick: this.mostrarPopupNuevo.bind(this)
    };
    this.editClick = this.editClick.bind(this);
  }

  ngOnInit(): void {
    this.tipoCliente = new TipoCliente();
    this.inicia();
  }

  inicia() {
    this.tipoClienteService.getAll().subscribe(res => {
      this.datos = res;
    });
  }

  async reload(url: string): Promise<boolean> {
    await this.router.navigateByUrl('.', { skipLocationChange: true });
    return this.router.navigateByUrl(url);
  }

  guardar(e): void {
    if (this.tipoCliente.de_TipoCliente === null || this.tipoCliente.de_TipoCliente === "") {
      alert('Por favor ingrese el tipo de cliente!', 'Mensaje').then(r => { });
      return;
    }

    this.isLoadPanelVisible = true;
    let result = confirm("<i>¿Desea guardar?</i>", "Confirmacion");
    result.then((dialogResult: any) => {
      if (dialogResult) {
        this.tipoClienteService.upsert(this.tipoCliente)
          .subscribe((res: any) => {
            if (res.result.statusCode === 200) {
              this.popupNuevoVisible = false;
              alert('Se guardó correctamente!', 'Mensaje').then(r => { });
              this.reload('tipo-cliente');
            }
          });
      }
    });
    this.isLoadPanelVisible = false;
  }

  editClick(e) {
    this.tipoClienteService.get(e.row.data.id)
      .subscribe((res: any) => {
        this.tipoCliente = res;
        this.popupNuevoVisible = true;
      })
  }

  mostrarPopupNuevo() {
    this.popupNuevoVisible = true;
    this.tipoCliente = new TipoCliente();
  }
}
