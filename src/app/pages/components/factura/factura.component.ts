import { Component, OnInit, ViewChild } from '@angular/core';
import { Factura } from '../models/factura.model';
import { FacturaService } from '../services/factura.service';
import { Router } from '@angular/router';
import { alert, confirm } from 'devextreme/ui/dialog';
import { ClienteService } from '../services/cliente.service';
import { Cliente } from '../models/cliente.model';
import { Producto } from '../models/producto.model';
import { ProductoService } from '../services/producto.service';
import { DxDataGridComponent } from 'devextreme-angular';
import { FacturaDetalle } from '../models/facturadetalle.model';

@Component({
  selector: 'app-factura',
  templateUrl: './factura.component.html',
  styleUrls: ['./factura.component.scss']
})
export class FacturaComponent implements OnInit {
  productos2: Producto[] = [];
  productos: Producto[] = [];
  clientes: Cliente[] = [];
  factura: Factura;
  fecha: (string | number | Date);
  popupNuevoVisible: boolean = false;
  isLoadPanelVisible: boolean = false;
  datos: any;
  popupNuevo: boolean;
  backButtonOptions: any;
  refreshButtonOptions: any;
  newOptions: any;
  currentFilter: any;

  constructor(public router: Router, private facturaService: FacturaService, private readonly clienteService: ClienteService, private readonly productoService: ProductoService) {
    this.backButtonOptions = {
      type: 'back',
      onClick: () => {
        this.router.navigate(['/home']);
      }
    };
    this.refreshButtonOptions = {
      icon: 'refresh',
      onClick: () => {
        this.reload('factura');
      }
    };
    this.newOptions = {
      icon: 'add',
      text: 'Nueva',
      type: 'default',
      stylingMode: 'text',
      onClick: this.mostrarPopupNuevo.bind(this)
    };
    this.editClick = this.editClick.bind(this);
  }

  ngOnInit(): void {
    this.factura = new Factura();
    this.inicia();
  }

  inicia() {
    this.clienteService.getAll().subscribe(res => this.clientes = res);
    this.facturaService.getNewInstance().subscribe(res => {
      this.factura = res;
      this.fecha = res.fh_Factura
    })
    this.facturaService.getAll().subscribe(res => {
      this.datos = res;
    });
    this.productoService.getAll().subscribe(res => this.productos = res);
  }

  async reload(url: string): Promise<boolean> {
    await this.router.navigateByUrl('.', { skipLocationChange: true });
    return this.router.navigateByUrl(url);
  }

  guardar(e): void {
    let subtotal=0;
    this.factura.imp_Subtotal=0;
    this.productos2.forEach(i => {
      const newDetalle = new FacturaDetalle();
      newDetalle.id_Producto = i.id;
      newDetalle.imp_PrecioUnitario = i.imp_Precio;
      newDetalle.nu_Cantidad = i.nu_Cantidad;
      newDetalle.imp_SubTotal = parseFloat((i.imp_Precio * i.nu_Cantidad).toFixed(2));
      this.factura.imp_Subtotal+=parseFloat((i.imp_Precio * i.nu_Cantidad).toFixed(2));
      this.factura.detalles.push(newDetalle);
    });
    this.factura.nu_Articulos = this.productos2.length;
    this.factura.imp_TotalImpuestos=parseFloat((this.factura.imp_Subtotal*0.19).toFixed(2));
    this.factura.imp_Total=this.factura.imp_Subtotal+this.factura.imp_TotalImpuestos;
    const resultadoValidacion:boolean|string = this.validarFactura(this.factura);
    if (resultadoValidacion !== true) {
      alert(resultadoValidacion.toString(), 'Mensaje').then(r => { });
      return;
    }

    console.log(this.factura)

    this.isLoadPanelVisible = true;

    let result = confirm("<i>¿Desea guardar?</i>", "Confirmacion");
    result.then((dialogResult: any) => {
      if (dialogResult) {
        this.facturaService.upsert(this.factura)
          .subscribe((res: any) => {
            this.isLoadPanelVisible = false;

            if (res && res.result && res.result.statusCode === 200) {
              this.popupNuevoVisible = false;
              alert('Se guardó correctamente!', 'Mensaje').then(r => { });
              this.reload('factura');
            } else {
              alert('Ocurrió un error al guardar. Intente nuevamente.', 'Error').then(r => { });
            }
          }, (error: any) => {
            this.isLoadPanelVisible = false;
            alert('Error en el servidor. Por favor intente más tarde.', 'Error').then(r => { });
          });
      } else {
        this.isLoadPanelVisible = false;
      }
    });
  }

  editClick(e) {
    
  }

  mostrarPopupNuevo() {
    this.popupNuevoVisible = true;
  }

  onValueChanged(e) {
    // Aquí puedes agregar lógica si necesitas manejar el cambio de algún valor específico en tu formulario.
  }
  @ViewChild('dataGrid2', { static: false }) dataGrid2: DxDataGridComponent;
  onEditorPreparing(e: any) {
    console.log(e)
    if (e.dataField === "id" && e.parentType === "dataRow") {
      e.editorOptions.onValueChanged = (args) => {
        console.log(args)
        // Encuentra el producto seleccionado en base al ID.
        const selectedProduct = this.productos.find(product => product.id === args.value);
        console.log(selectedProduct)
        // Actualiza la imagen de la fila correspondiente.
        if (selectedProduct) {
          this.dataGrid2.instance.cellValue(e.row.rowIndex, 'img_Producto64', selectedProduct.img_Producto64);
          this.dataGrid2.instance.cellValue(e.row.rowIndex, 'de_Producto', selectedProduct.de_Producto);
          this.dataGrid2.instance.cellValue(e.row.rowIndex, 'id', selectedProduct.id);
          this.dataGrid2.instance.cellValue(e.row.rowIndex, 'imp_Precio', selectedProduct.imp_Precio);
          this.dataGrid2.instance.cellValue(e.row.rowIndex, 'nu_Cantidad', selectedProduct.nu_Cantidad);
        }
      };
    }
  }
  getImageForProduct(productId: number): string {
    // Encuentra la imagen del producto basado en el ID.
    const product = this.productos.find(p => p.id === productId);
    console.log(product)
    return product ? product.img_Producto64 : '';
  }
  nuevo() {
    console.log(this.factura)
    console.log(this.productos2);
   
    console.log(this.productos2.length)
    console.log(this.factura)
  }
  newRow(e) {
    let product = this.productos.find(p => p.id === e.data.id);
    var index = this.productos2.findIndex(p => p.id === product.id);
    if (index > -1) {
      this.productos2.splice(index, 1);
      this.productos2.push(product)
    }
    else {
      this.productos2.push(product)
    }


    console.log(this.productos2)
  }
  calculateTotal(rowData) {
    if (rowData.imp_Precio && rowData.nu_Cantidad)
      return parseFloat((rowData.imp_Precio * rowData.nu_Cantidad).toFixed(2));
    else return 0;
  }
  validarFactura(factura: Factura): boolean | string {
    
    if (typeof factura.id_Cliente !== 'number' || factura.id_Cliente <= 0) {
      return 'Debe seleccionar un Cliente.';
    }
    if (typeof factura.nu_Factura !== 'number' || factura.nu_Factura <= 0) {
      return 'El número de la factura debe ser un número positivo.';
    }
    if (typeof factura.nu_Articulos !== 'number' || factura.nu_Articulos < 0) {
      return 'El número de artículos debe ser un número no negativo.';
    }
    if (typeof factura.imp_Subtotal !== 'number' || factura.imp_Subtotal < 0) {
      return 'El subtotal debe ser un número no negativo.';
    }
    if (typeof factura.imp_TotalImpuestos !== 'number' || factura.imp_TotalImpuestos < 0) {
      return 'Los impuestos totales deben ser un número no negativo.';
    }
    if (typeof factura.imp_Total !== 'number' || factura.imp_Total < 0) {
      return 'El total debe ser un número no negativo.';
    }
    if (!Array.isArray(factura.detalles) || factura.detalles.length === 0) {
      return 'Debe haber al menos un detalle en la factura.';
    }

    for (const detalle of factura.detalles) {

      if (typeof detalle.id_Producto !== 'number' || detalle.id_Producto <= 0) {
        return 'Cada detalle debe tener un ID de producto válido.';
      }

    }

    return true;
  }
  actualiza(e){
    this.factura.imp_Subtotal=0;
    this.productos2.forEach(i => {
      this.factura.imp_Subtotal+=parseFloat((i.imp_Precio * i.nu_Cantidad).toFixed(2));
    });
    this.factura.imp_TotalImpuestos=parseFloat((this.factura.imp_Subtotal*0.19).toFixed(2));
    this.factura.imp_Total=this.factura.imp_Subtotal+this.factura.imp_TotalImpuestos;
    console.log(this.productos2)
  }
  nu_Factura:string='';
  id_Cliente:number=0;
  onValueChangedCliente(e){
    if(e.value>0){
      this.id_Cliente=e.value;
      this.facturaService.getAllByCliente(e.value,this.nu_Factura==''?-1:this.nu_Factura).subscribe(res=>this.datos=res);
    }
  }
  onValueChangedNumero(e){
    if(e.value>0){
      this.nu_Factura=e.value;
      this.facturaService.getAllByCliente(this.id_Cliente==0?-1:this.id_Cliente,e.value).subscribe(res=>this.datos=res);
    }
  }
}
