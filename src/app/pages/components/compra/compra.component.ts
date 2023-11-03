import { Component, OnInit } from '@angular/core';
import { ArticuloService } from '../services/articulo.service';
import { ClienteArticuloService } from '../services/clientearticulo.service';

@Component({
  selector: 'app-compra',
  templateUrl: './compra.component.html',
  styleUrls: ['./compra.component.scss']
})
export class CompraComponent implements OnInit {
  datos:any;
  constructor(private clienteArticuloService:ClienteArticuloService){

  }
  ngOnInit(): void {
    this.inicia();
  }
  inicia(){
    this.datos=[];
    this.clienteArticuloService.get(1).subscribe(res=>{
      this.datos=res;
    });
  }
  agregar(){
    console.log(this.datos)
  }
  eliminar(id){
    this.clienteArticuloService.delete(id).subscribe(res=>{
      if(res.result.statusCode === 200){
        var index=this.datos.findIndex(res=>res.id_ClienteArticulo==id);
        if(index!=-1){
          this.datos.splice(index, 1);
        }
      }
    });
  }
}
