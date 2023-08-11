import Agentes from "./agentes.entity";
import Documento from "./documentos.entity";
import Domicilios from "./domicilios.entity";
import Movimiento from "./movimientos.entity";
import Externo from "./externos.entity";


export type empresa = 'cdc'|'cmp'|'corp';

export type entidad = Agentes | Documento | Domicilios | Movimiento | Externo;