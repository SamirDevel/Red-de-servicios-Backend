import {Entity, Column, PrimaryGeneratedColumn, OneToMany, VirtualColumn
    , AfterLoad, OneToOne, JoinColumn} from 'typeorm';
import DetalleComisionChofer from './detalle.comision.chofer.entity';

@Entity({name:'Registro_Comision_Chofer'})
export default class RegistroComisionChofer{
    @PrimaryGeneratedColumn({name:'Id'})
    id:number;

    @Column({name:'Fecha_Inicial'})
    inicio:Date

    @Column({name:'Fecha_Final'})
    final:Date
    
    @Column({name:'Codigo_Chofer'})
    chofer:string

    @Column({name:'Viajes_Foraneos'})
    foraneos:number

    @Column('decimal',{name:'Pago_Foraneos', scale:2, precision:12})
    pagadoForaneos:number

    @Column({name:'Viajes_Jalisco'})
    aJalisco:number

    @Column('decimal',{name:'Pago_Jalisco', scale:2, precision:12})
    pagadoJalisco:number

    @Column({name:'Paradas_Locales'})
    paradas:number

    @Column('decimal',{name:'Pago_Paradas', scale:2, precision:12})
    pagadoParadas:number

    @Column({name:'Viajes_Auxiliar'})
    auxiliar:number    

    @Column('decimal',{name:'Pago_Auxiliar', scale:2, precision:12})
    pagadoAuxiliar:number

    @Column('decimal',{name:'Recalculos', scale:2, precision:12})
    recalculo:number

    @Column({name:'Motivo'})
    motivo:string

    @Column({name:'Tipo_Recalculo'})
    tipoRecalculo:string

    @VirtualColumn({query:(alias)=>`SELECT  CNOMBREAGENTE
    FROM ${process.env.DB_NAME_CDC}.dbo.admAgentes ag
    WHERE ag.CCODIGOAGENTE = ${alias}.Codigo_Chofer`})
    nombre:string

    @VirtualColumn({query:(alias)=>`SELECT  Tipo
    FROM Viajes.dbo.Chofer cho
    WHERE Cho.Codigo = ${alias}.Codigo_Chofer`})
    tipo:number

    @VirtualColumn({query:(alias)=>`SELECT COUNT(*)
        FROM Detalle_Comision_Chofer
        WHERE Id_Registro_Chofer = ${alias}.Id`})
    viajes:number

    @VirtualColumn({query:(alias)=>`${alias}.Pago_Foraneos / (CASE WHEN Viajes_Foraneos = 0 THEN 1 ELSE Viajes_Foraneos END)`})
    pagaForaneos:number

    @VirtualColumn({query:(alias)=>`${alias}.Pago_Jalisco / (CASE WHEN Viajes_Jalisco = 0 THEN 1 ELSE Viajes_Jalisco END)`})
    pagaJalisco:number

    @VirtualColumn({query:(alias)=>`${alias}.Pago_Paradas / (CASE WHEN Paradas_Locales = 0 THEN 1 ELSE Paradas_Locales END)`})
    pagaParadas:number

    @VirtualColumn({query:(alias)=>`${alias}.Pago_Auxiliar / (CASE WHEN Viajes_Auxiliar = 0 THEN 1 ELSE Viajes_Auxiliar END)`})
    pagaAuxiliar:number

    @OneToMany(()=>DetalleComisionChofer, (det)=>det.idRegistro,{cascade:true})
    detalles:DetalleComisionChofer[]    
}