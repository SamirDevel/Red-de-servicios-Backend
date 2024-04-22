import {Entity, Column, PrimaryGeneratedColumn, OneToMany, VirtualColumn
, AfterLoad, OneToOne, JoinColumn} from 'typeorm';
import RelacionesAgentesDes from './relaciones.agentes.entity';

@Entity({name: 'Agentes'})
export default class AgentesDes{
    setAgenteDes(grupo:number, codigo:string){
        this.grupo = grupo
        this.codigo = codigo
        this.estatus = 'ACTIVO'
    }

    @PrimaryGeneratedColumn({name:'Id'})
    id:number;

    @Column({name:'Codigo'})
    codigo:string;

    @Column({name:'Grupo'})
    grupo:number;

    @Column({name:'Estatus'})
    estatus:string;

    @Column({name:'Nombre_Esquema'})
    esquema:string;

    @OneToMany(()=>RelacionesAgentesDes, rel=>rel.codAdmin)
    dependientes:RelacionesAgentesDes[]

    @VirtualColumn({query(alias) {
        return `(SELECT CNOMBREAGENTE FROM ${process.env.DB_NAME_CDC}.dbo.admAgentes WHERE CCODIGOAGENTE = ${alias}.Codigo)`
    },})
    nombre:string
}

/*
AND pago.CIDCONCEPTODOCUMENTO != (doc.CIDDOCUMENTODE = 4 OR doc.CIDCONCEPTODOCUMENTO = (CASE
            WHEN DB_NAME() = '${process.env.DB_NAME_CDC}' THEN 3015
            WHEN DB_NAME() = '${process.env.DB_NAME_CMP}' THEN 3016
        END)
		AND doc.CCANCELADO = 0
		AND pago.CCANCELADO = 0
        AND (doc.CIDDOCUMENTODE = 4 OR doc.CIDCONCEPTODOCUMENTO = (CASE
            WHEN DB_NAME() = '${process.env.DB_NAME_CDC}' THEN 3045
            WHEN DB_NAME() = '${process.env.DB_NAME_CMP}' THEN 3038
        END))
		AND (doc.CFECHA + cli.CDIASCREDITOCLIENTE)>= :inicio`
        ///
        AND (doc.CFECHA + cli.CDIASCREDITOCLIENTE)<= :final
*/