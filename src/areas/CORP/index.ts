import { FacturacionModule } from "./facturacion/facturacion.module";
import { RecursosHumanosModule } from "./recursos.humanos/recursos.humanos.module";
import { CreditoCobranzaModule } from "./credito.cobranza/credito.cobranza.module";
import { AlmacenInventarioModule } from "./almacen.inventario/almacen.inventario.module";
import { VentasModule } from "./ventas/ventas.module";

const modulosList:any = [
    FacturacionModule,
    RecursosHumanosModule,
    CreditoCobranzaModule,
    AlmacenInventarioModule,
    VentasModule
]

export default modulosList;