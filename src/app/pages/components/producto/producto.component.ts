import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { alert, confirm } from 'devextreme/ui/dialog';
import { Producto } from '../models/producto.model';
import { ProductoService } from '../services/producto.service';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.scss']
})
export class ProductoComponent implements OnInit {
  originalImageURL: string;
  imageURL: string;
  producto: Producto;
  popupNuevoVisible: boolean = false;
  isLoadPanelVisible: boolean = false;
  datos: any;
  backButtonOptions: any;
  refreshButtonOptions: any;
  newOptions: any;
  currentFilter: any;

  archivosC: any[] = [];
  formDataC: FormData = new FormData();
  fileUpload = { status: '', message: '', filePath: '' };
  public selectedFile: File = null;

  constructor(public router: Router, private productoService: ProductoService) {
    this.backButtonOptions = {
      type: 'back',
      onClick: () => {
        this.router.navigate(['/home']);
      }
    };
    this.refreshButtonOptions = {
      icon: 'refresh',
      onClick: () => {
        this.reload('producto');
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
    this.inicia();
  }

  inicia() {
    this.producto = new Producto();
    this.formDataC = new FormData();
    this.productoService.getAll().subscribe(res => {
      this.datos = res;
      console.log(this.datos)
    });
  }

  async reload(url: string): Promise<boolean> {
    await this.router.navigateByUrl('.', { skipLocationChange: true });
    return this.router.navigateByUrl(url);
  }

  guardar(e): void {
    if (!this.producto.de_Producto || this.producto.de_Producto.trim() === "") {
      alert('Por favor ingrese la descripción del producto!', 'Mensaje').then(r => { });
      return;
    }
    if (this.producto.imp_Precio == null || this.producto.imp_Precio == 0) {
      alert('Por favor ingrese el precio!', 'Mensaje').then(r => { });
      return;
    }
    if (this.archivosC.length <= 0) {
      if (this.originalImageURL) {
        this.imageURL = this.originalImageURL;
      } else {
        alert('Es obligatorio adjuntar imagen del producto', 'Archivos').then(r => { });
        return;
      }
    }
    if (this.archivosC.length <= 0 && this.originalImageURL) {
      const blob = this.base64ToBlob(this.originalImageURL, 'image/jpeg');
      this.formDataC.append('files', blob, 'imagen.jpg');
  }
    this.isLoadPanelVisible = true;
    let result = confirm("<i>¿Desea guardar?</i>", "Confirmación");
    result.then((dialogResult: any) => {
      if (dialogResult) {
        this.formDataC.append('producto', JSON.stringify(this.producto));
        this.productoService.upload(this.formDataC).subscribe(res => {
          if (res.result.statusCode === 200) {
            this.popupNuevoVisible = false;
            alert('Se guardó correctamente!', 'Mensaje').then(r => { });
            this.reload('producto');
          }
        });
      }
    });
    this.isLoadPanelVisible = false;
  }
  base64ToBlob(b64Data, contentType = '', sliceSize = 512) {
    const byteCharacters = atob(b64Data.split(',')[1]);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
      offset += sliceSize;
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }
  editClick(e) {
    console.log(e)
    this.imageURL = '';
    this.productoService.get(e.row.data.id).subscribe((res: any) => {
      this.producto = res;
      this.imageURL = res.img_Producto64;
      this.originalImageURL = this.imageURL;
      this.popupNuevoVisible = true;
    })
  }

  mostrarPopupNuevo() {
    this.popupNuevoVisible = true;
    this.producto = new Producto();
    this.imageURL = '';
  }

  onFileCotizaSelected(event) {
    this.archivosC = [];
    this.formDataC = new FormData();
    for (let index = 0; index < event.target.files.length; index++) {
      this.selectedFile = <File>event.target.files[index];
      var arch = (Date.now()) + this.selectedFile.name;
      this.archivosC.push({ "archivo": arch, "size": this.selectedFile.size / 1024 });
      this.formDataC.append('files', this.selectedFile, arch);
    }
    const file = (event.target as HTMLInputElement).files[0];
    // File Preview
    const reader = new FileReader();
    reader.onload = () => {
      this.imageURL = reader.result as string;
    }
    reader.readAsDataURL(file)
  }
  uint8ArrayToBase64(bytes) {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    // Convertir la cadena binaria a base64 usando btoa()
    return window.btoa(unescape(encodeURIComponent(binary)));
  }

  byteArrayToImageSrc(byteArray: any): string {
    if (byteArray) {
      const base64String = this.uint8ArrayToBase64(byteArray);
      console.log(base64String)
      return 'data:image/jpeg;base64,' + base64String;
    }
    return null;
  }
  calculateTotal(rowData) {
    return rowData.imp_Precio * rowData.nu_Cantidad;
  }
  
}
