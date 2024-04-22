import Areas from "./areas.entity";
import Usuarios from "./usuarios.entity";
import AgentesDes from "./agentes.des.entity";
import RelacionesAgentesDes from "./relaciones.agentes.entity";
import AgenteRH from "src/entidades/entidadesCORP/Extendidas/rh.agente.entity";
import RHRel from "src/entidades/entidadesCORP/Extendidas/rh.agete.rel.entity";
const entidadesCuentas:any = [
    Usuarios,
    Areas,
    AgentesDes,
    RelacionesAgentesDes,
    AgenteRH,
    RHRel,
]

export default entidadesCuentas