import { Entity, Column, PrimaryColumn, OneToMany, OneToOne, AfterLoad,
VirtualColumn } from "typeorm";
import Documento from "./documentos.entity";
import Externo from "./externos.entity";

interface agente{
    codigo:string
    nombre:string
}

interface chofer extends agente{
    rfc:string
    licencia:string
}

interface auto extends agente{
    placas:string
    aseguradora:string
    poliza:string
    configuracion:string
    tipoPermiso:string
    numPermiso:string
    año:number
}

@Entity({name:'admAgentes'})
export default class Agente{
    
    setAgente(agente:agente){
        this.codigo = agente.codigo
        this.nombre = agente.nombre
        this.alta = new Date();
        this.tipo = 2;
        this.comisionVenta = 0;
        this.comisionCobro = 0;
        this.idCliente = 0;
        this.idProveedor = 0;
        this.clasificacion1 = 0;
        this.clasificacion2 = 0;
        this.clasificacion3 = 0;
        this.clasificacion4 = 0;
        this.clasificacion5 = 0;
        this.clasificacion6 = 0;
        this.segmento1 = '';
        this.txt1 = '';
        this.txt2 = '';
        this.txt3 = '';
        this.fechaExtra = new Date('1899-12-30 00:00:00.000');
        this.importeExtra1 = 0;
        this.importeExtra2 = 0;
        this.importeExtra3 = 0;
        this.importeExtra4 = 0;
        this.timeStamp = new Date();
        this.segmento2 = '';
        this.segmento3 = '';
    }
    
    setChofer(chofer:chofer){
        this.setAgente({nombre:chofer.nombre, codigo:chofer.codigo})
        this.segmento1 = chofer.rfc;
        this.txt1 = chofer.licencia
        this.txt3 = 'Operador'
        this.idCliente = 0
        this.tipo = 4;
    }

    setAuto(auto:auto){
        this.setAgente({nombre:auto.nombre, codigo:auto.codigo})
        this.idCliente = 1
        this.idProveedor = auto.año
        this.segmento1 = auto.placas
        this.txt1 = auto.numPermiso
        this.txt2 = auto.aseguradora
        this.txt3 = auto.poliza
        this.segmento2 = auto.tipoPermiso
        this.segmento3 = auto.configuracion
        this.tipo = 5
    }

    @PrimaryColumn({name:'CIDAGENTE'})
    id:number
    
    @Column({name:'CCODIGOAGENTE'})
    codigo:string
    
    @AfterLoad()
    toUpper(){
        this.nombre = this.nombre.toUpperCase();
    }
    @Column({name:'CNOMBREAGENTE',})
    nombre:string
    
    @Column({name:'CFECHAALTAAGENTE'})
    alta:Date
    
    @Column({name:'CTIPOAGENTE'})
    tipo:number
    
    @Column({name:'CCOMISIONVENTAAGENTE'})
    comisionVenta:number
    
    @Column({name:'CCOMISIONCOBROAGENTE'})
    comisionCobro:number
    
    @Column({name:'CIDCLIENTE'})
    idCliente:number
    
    @Column({name:'CIDPROVEEDOR'})
    idProveedor:number
    
    @Column({name:'CIDVALORCLASIFICACION1'})
    clasificacion1:number
    
    @Column({name:'CIDVALORCLASIFICACION2'})
    clasificacion2:number
    
    @Column({name:'CIDVALORCLASIFICACION3'})
    clasificacion3:number
    
    @Column({name:'CIDVALORCLASIFICACION4'})
    clasificacion4:number
    
    @Column({name:'CIDVALORCLASIFICACION5'})
    clasificacion5:number
    
    @Column({name:'CIDVALORCLASIFICACION6'})
    clasificacion6:number
    
    @Column({name:'CSEGCONTAGENTE'})
    segmento1:string
    
    @Column({name:'CTEXTOEXTRA1'})
    txt1:string
    
    @Column({name:'CTEXTOEXTRA2'})
    txt2:string
    
    @Column({name:'CTEXTOEXTRA3'})
    txt3:string
    
    @Column({name:'CFECHAEXTRA'})
    fechaExtra:Date
    
    @Column({name:'CIMPORTEEXTRA1'})
    importeExtra1:number
    
    @Column({name:'CIMPORTEEXTRA2'})
    importeExtra2:number
    
    @Column({name:'CIMPORTEEXTRA3'})
    importeExtra3:number
    
    @Column({name:'CIMPORTEEXTRA4'})
    importeExtra4:number
    
    @Column({name:'CTIMESTAMP'})
    timeStamp:Date
    
    @Column({name:'CSCAGENTE2'})
    segmento2:string
    
    @Column({name:'CSCAGENTE3'})
    segmento3:string

    @OneToMany(() =>Documento, doc=>doc.idAgente)
    documentos:Documento[]

    @OneToOne(()=>Externo, ext=>ext.idAgenteVenta)
    cliente:Externo
    
    @VirtualColumn({query(alias) {
        return `(SELECT ag.Estatus FROM ${process.env.DB_NAME_CUENTAS}.dbo.Agentes ag WHERE ag.Codigo = ${alias}.CCODIGOAGENTE)`
    },})
    estatus:string

}