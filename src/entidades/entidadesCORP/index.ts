import Agentes from "./agentes.entity";
import Documento from "./documentos.entity";
import Domicilios from "./domicilios.entity";
import Movimiento from "./movimientos.entity";
import Externo from "./externos.entity";
import AsocCargosAbonos from "./asociacion.cargos.abonos";
import ClasificacionesValores from "./clasificaciones.valores";
import Producto from "./productos.entity";
//Entidades con herencia
import AgenteChofer from "src/entidades/entidadesCORP/Extendidas/Agente.chofer.entity";
import DomicilioChofer from "src/entidades/entidadesCORP/Extendidas/Domicilio.chofer.entity";
import ProductoPicking from "src/entidades/entidadesCORP/Extendidas/Producto.picking.entity";
//Vistas

const entidadesList:any = [
    Externo, Agentes, Documento, Domicilios, Movimiento, AsocCargosAbonos
    ,ClasificacionesValores, Producto 
    //Entidades con herencia
    ,AgenteChofer
    ,DomicilioChofer, ProductoPicking,
    //Vistas
];

export default entidadesList;