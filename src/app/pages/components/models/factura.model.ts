import { FacturaDetalle } from "./facturadetalle.model";

export class Factura {
    id: number;
    fh_Factura: Date;
    nu_Factura: number;
    id_Cliente: number;
    nu_Articulos: number;
    imp_Subtotal: number;
    imp_TotalImpuestos: number;
    imp_Total: number;
    detalles: FacturaDetalle[];
}








