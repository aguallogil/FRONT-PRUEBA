import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { alert, confirm } from 'devextreme/ui/dialog';
import { ClienteService } from '../services/cliente.service';
import { Cliente } from '../models/cliente.model';
import { TipoClienteService } from '../services/tipocliente.service';


@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.scss']
})
export class ClienteComponent implements OnInit{
  tiposclientes:[any];
  cliente: Cliente;
  popupNuevoVisible: boolean = false;
  isLoadPanelVisible: boolean = false;
  datos: any;
  popupNuevo: boolean;
  backButtonOptions: any;
  refreshButtonOptions: any;
  newOptions: any;
  currentFilter: any;

  constructor(public router: Router, private clienteService: ClienteService,private tipoClienteService:TipoClienteService) {
    this.backButtonOptions = {
      type: 'back',
      onClick: () => {
        this.router.navigate(['/home']);
      }
    };
    this.refreshButtonOptions = {
      icon: 'refresh',
      onClick: () => {
        this.reload('cliente');
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
    this.cliente = new Cliente();
    this.inicia();
  }

  inicia() {
    this.clienteService.getAll().subscribe(res => {
      this.datos = res;
    });
    this.tipoClienteService.getAll().subscribe(res=>this.tiposclientes=res);
  }

  async reload(url: string): Promise<boolean> {
    await this.router.navigateByUrl('.', { skipLocationChange: true });
    return this.router.navigateByUrl(url);
  }

  guardar(e): void {
    if (!this.cliente.de_RazonSocial || this.cliente.de_RazonSocial.trim() === "") {
      alert('Por favor ingrese la razón social!', 'Mensaje').then(r => {});
      return;
    }
    if (!this.cliente.rfc || this.cliente.rfc.trim() === "") {
      alert('Por favor ingrese el RFC!', 'Mensaje').then(r => {});
      return;
    }
    if (!this.cliente.rfc || this.cliente.rfc.trim() === "" || this.cliente.rfc.trim().length !== 13) {
      alert('Por favor ingrese un RFC válido con 13 caracteres!', 'Mensaje').then(r => {});
      return;
    }
    if (!this.cliente.id_TipoCliente) {
      alert('Por favor ingrese el tipo de cliente!', 'Mensaje').then(r => {});
      return;
    }

    this.isLoadPanelVisible = true;

    let result = confirm("<i>¿Desea guardar?</i>", "Confirmacion");
    result.then((dialogResult: any) => {
      if (dialogResult) {
        this.clienteService.upsert(this.cliente)
          .subscribe((res: any) => {
            this.isLoadPanelVisible = false;

            if (res && res.result && res.result.statusCode === 200) {
              this.popupNuevoVisible = false;
              alert('Se guardó correctamente!', 'Mensaje').then(r => {});
              this.reload('cliente');
            } else {
              alert('Ocurrió un error al guardar. Intente nuevamente.', 'Error').then(r => {});
            }
          }, (error: any) => {
            this.isLoadPanelVisible = false;
            alert('Error en el servidor. Por favor intente más tarde.', 'Error').then(r => {});
          });
      } else {
        this.isLoadPanelVisible = false;
      }
    });
  }

  editClick(e) {
    console.log(e.row.data)
    this.clienteService.get(e.row.data.id) // Cambié "id_Cliente" por "Id" porque tu entidad tiene "Id" como identificador.
      .subscribe((res: any) => {
        this.cliente = res;
        this.popupNuevoVisible = true;
      });
  }

  mostrarPopupNuevo() {
    this.popupNuevoVisible = true;
    this.cliente = new Cliente();
  }
  onValueChanged(e) {
    // if (e.value)
    // {
    //   this.id_Tienda=e.value;
    //   this.articuloTiendaService.get(e.value).subscribe(res=>{
    //     this.data=res;
    //   });
    // }
  }
}
