import { Entity, Column, PrimaryGeneratedColumn, OneToMany,
    VirtualColumn, JoinColumn, ManyToOne, AfterLoad } from "typeorm";
import Chofer from "./chofer.entity";
import Vehiculo from "./vehiculo.entity";
import DetalleViaje from "./detalleViaje.entity";
import Serie from "./serie.entity";

@Entity({name:'Viaje'})
export default class Viaje{
    @PrimaryGeneratedColumn({type:'integer', name:'Id'})
    id:number;

    @ManyToOne(()=>Serie, ser=>ser.viajes)
    @JoinColumn({name:'Id_Serie'})
    serie:Serie;

    @Column({name:'Empresa'})
    empresa:string;
    
    @Column({name:'Folio'})
    folio:number

    @Column({name:'Fecha_Expedicion'})
    expedicion:Date

    @Column({name:'Dias_Estimados'})
    dias:number;

    @ManyToOne(()=>Chofer, cho=>cho.id)
    @JoinColumn({name:'Id_Chofer'})
    chofer:Chofer

    @ManyToOne(()=>Chofer, cho=>cho.id)
    @JoinColumn({name:'Id_Auxiliar'})
    auxiliar:Chofer

    @ManyToOne(()=>Vehiculo, veh=>veh.id)
    @JoinColumn({name:'Id_Vehiculo'})
    vehiculo:Vehiculo;

    @Column({name:'Codigo_Ruta'})
    ruta:string;

    @Column({name:'Id_Usuario'})
    usuario:number;

    @Column({name:'Estatus'})
    estatus:string;

    @Column({name:'Fecha_Inicio'})
    fechaInicio:Date

    @Column({name:'Hora_Inicio'})
    horaInicio:string;

    @Column({name:'Km_Inicial'})
    kmInicial:number;

    @Column('decimal', {name:'Gas_Inicial', scale:4, precision:12})
    gasInicial:number;

    @Column({name:'Observacion_Salida'})
    observacionSalida:string;

    @Column({name:'Fecha_Fin'})
    fechaFin:Date;

    @Column({name:'Hora_Fin'})
    horaFin:string;

    @Column({name:'Km_Final'})
    kmFinal:number;

    @Column('decimal', {name:'Gas_Final', scale:4, precision:12})
    gasFinal:number;

    @Column({name:'Cargas_Gas'})
    cargas:number;

    @Column({name:'Observacion_Llegada'})
    observacionLlegada:string;

    @VirtualColumn({
        query:alias=>{
        return `SELECT us.Nombre FROM ${process.env.DB_NAME_CUENTAS}.dbo.Usuarios us
        WHERE ${alias}.Id_Usuario = us.Id`
    }})
    nombreUsuario:string

    @VirtualColumn({
        query:alias=>{
        return `SELECT RUTA
     FROM (
        SELECT CVALORCLASIFICACION AS RUTA
        ,CCODIGOVALORCLASIFICACION AS CODIGO
        FROM ${process.env.DB_NAME_CDC}.dbo.admClasificacionesValores
        WHERE CIDCLASIFICACION = 7
        UNION
        SELECT CVALORCLASIFICACION
        ,CCODIGOVALORCLASIFICACION AS CODIGO
        FROM ${process.env.DB_NAME_CMP}.dbo.admClasificacionesValores
        WHERE CIDCLASIFICACION = 7
     )sq
     WHERE CODIGO = ${alias}.Codigo_Ruta`
    }})
    nombreRuta:string

    nombreTipoRuta:string;

    @AfterLoad()
    setNombreTipoRuta(){
        if(this.tipoRuta!==undefined){
            if(this.tipoRuta===1)this.nombreTipoRuta = 'Foraneo'
            else if(this.tipoRuta===2)this.nombreTipoRuta = 'Jalisco'
            else if(this.tipoRuta===3)this.nombreTipoRuta = 'Local'
            else if(this.tipoRuta===4)this.nombreTipoRuta = 'Auxiliar'
        }
    }

    consumo:number

    @AfterLoad()
    setConsumo(){
        this.consumo = (()=>{
            if(this.estatus === 'COMPLETADO'){
                return ((this.gasInicial *this.vehiculo.capacidad) + this.cargas - (this.gasFinal * this.vehiculo.capacidad))
            }
            else{
                return 0
            }
        })() 
    }

    @VirtualColumn({query:alias=>{
        return `SELECT CSEGCONT1 AS tipo
        FROM
        ${process.env.DB_NAME_CMP}.dbo.admClasificacionesValores
        WHERE ${alias}.Codigo_Ruta = CCODIGOVALORCLASIFICACION
        UNION
        SELECT CSEGCONT1 AS tipo
        FROM
        ${process.env.DB_NAME_CDC}.dbo.admClasificacionesValores
        WHERE ${alias}.Codigo_Ruta = CCODIGOVALORCLASIFICACION
        `
    }})
    tipoRuta:number

    @OneToMany(()=>DetalleViaje, det=>det.viaje, {cascade:true})
    detalles:DetalleViaje[]
}

/*
@VirtualColumn({query:alias=>{
        return `CASE
            WHEN ${alias}.Estatus != 'COMPLETADO' THEN 0
            ELSE ROUND((${alias}.Gas_Inicial * 
                (SELECT Capacidad FROM ${process.env.DB_NAME_VIAJES}.dbo.Vehiculo WHERE ${alias}.Id_Vehiculo = Vehiculo.Id))
                + ${alias}.Cargas_Gas
                - 
                (${alias}.Gas_Final * 
                (SELECT Capacidad FROM ${process.env.DB_NAME_VIAJES}.dbo.Vehiculo WHERE ${alias}.Id_Vehiculo = Vehiculo.Id)), 2)
        END`
    }})
    consumo:number
*/