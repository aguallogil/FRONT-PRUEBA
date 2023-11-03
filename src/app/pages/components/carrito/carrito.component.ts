import { Component, OnInit } from '@angular/core';
import { ArticuloService } from '../services/articulo.service';
import {  Router } from '@angular/router';
import { ClienteArticuloService } from '../services/clientearticulo.service';
import { ClienteArticulo } from '../models/clientearticulo.model';
import { alert, confirm } from 'devextreme/ui/dialog';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.scss']
})
export class CarritoComponent implements OnInit{
  countCarrito:number;
  carrito:any;
  datos:any;
  comprar:any[];
  constructor(private articuloService:ArticuloService,
    private clienteArticuloService:ClienteArticuloService,
    public router:Router){

  }
  ngOnInit(): void {
    this.inicia();
  }
  inicia(){
    this.countCarrito=0;
    this.datos=[];
    this.comprar=[];
    this.articuloService.getAllImagen(JSON.parse(localStorage.getItem('currentUser')).id_Tienda).subscribe(res=>{
      this.datos=res;
    });
    this.clienteArticuloService.get(JSON.parse(localStorage.getItem('currentUser')).id_Cliente).subscribe(res=>{
      this.carrito=res;
      this.countCarrito=res.length;
    });
  }
  async reload(url: string): Promise<boolean> {
    await this.router.navigateByUrl('.', { skipLocationChange: true });
    return this.router.navigateByUrl(url);
  }
  agregar(){
    console.log(this.comprar);
    if(this.comprar.length>0)
    {
      this.clienteArticuloService.upsert(this.comprar).subscribe(res=>{
        if(res.result.statusCode === 200){
          this.router.navigate(['/compra']);
        }
      });
    }
  }
  add(item){
    var clienteArticulo=new ClienteArticulo();
    clienteArticulo.id_Articulo=item.id_Articulo;
    clienteArticulo.id_Tienda=item.id_Tienda;
    clienteArticulo.id_Cliente=JSON.parse(localStorage.getItem('currentUser')).id_Cliente;
    clienteArticulo.id_Tienda=JSON.parse(localStorage.getItem('currentUser')).id_Tienda;
    clienteArticulo.nu_Cantidad=item.nu_Cantidad;
    var index=this.comprar.findIndex(res=>res.id_Articulo==item.id_Articulo);
    if(index!=-1){
      this.comprar.splice(index, 1);
    }
    this.comprar.push(clienteArticulo);
    if(this.carrito.filter(res=>res.id_Articulo==item.id_Articulo).length==0){
      this.countCarrito+=1;
    }
  }
  irCarrito(event){
    event.preventDefault()
    this.router.navigate(['/compra']);
  }
}
