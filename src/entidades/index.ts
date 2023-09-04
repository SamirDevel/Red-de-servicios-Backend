import Agentes from "./agentes.entity";
import Documento from "./documentos.entity";
import Domicilios from "./domicilios.entity";
import Movimiento from "./movimientos.entity";
import Externo from "./externos.entity";
import AsocCargosAbonos from "./asociacion.cargos.abonos";
const entidadesList:any = [
    Externo, Agentes, Documento, Domicilios, Movimiento, AsocCargosAbonos
];

export default entidadesList;