export class FacturaDetalle {
    id: number;
    id_Factura: number;
    id_Producto: number;
    nu_Cantidad: number;
    imp_PrecioUnitario: number;
    imp_SubTotal: number;
    notas: string;

    constructor() {
        this.id = 0;
        this.id_Factura = 0;
        this.id_Producto = 0;
        this.nu_Cantidad = 0;
        this.imp_PrecioUnitario = 0;
        this.imp_SubTotal = 0;
        this.notas = '';
    }
}
