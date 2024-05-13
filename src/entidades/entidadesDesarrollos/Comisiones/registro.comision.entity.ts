import {Entity, Column, PrimaryGeneratedColumn, OneToMany, VirtualColumn
    , AfterLoad, ManyToOne, JoinColumn} from 'typeorm';
import DetalleComision from './detalle.comision.entity';

@Entity({name:'Registro_Comision'})
export default class RegistroComision{
    @PrimaryGeneratedColumn({name:'Id'})
    id:number;

    @Column({name:'Codigo_Agente'})
    agente:string

    @Column('decimal',{name:'Cobranza', scale:2, precision:12})
    cobranza:number

    @Column('decimal', {name:'A_Tiempo', scale:2, precision:12})
    aTiempo:number

    @Column('decimal', {name:'Fuera_Tiempo', scale:2, precision:12})
    fueraTiempo:number

    @Column({name:'Esquema'})
    esquema:string

    @Column('decimal',{name:'Porcentaje', scale:2, precision:12})
    porcentaje:number

    @Column('decimal', {name:'Descuentos', scale:2, precision:12})
    descuentos:number

    @Column('decimal', {name:'Anticipo', scale:2, precision:12})
    anticipo:number

    @Column({name:'Fecha_Inicio'})
    inicio:Date

    @Column({name:'Fecha_Final'})
    final:Date

    @Column('decimal',{name:'Penalizacion', scale:2, precision:12})
    penalizacion:number

    @VirtualColumn({query:(alias)=>`SELECT  GRUPO
    FROM Cuentas.dbo.Agentes ag
    WHERE ag.Codigo = ${alias}.Codigo_Agente`})
    tipo:number

    @VirtualColumn({query:(alias)=>`SELECT  CNOMBREAGENTE
    FROM ${process.env.DB_NAME_CDC}.dbo.admAgentes ag
    WHERE ag.CCODIGOAGENTE = ${alias}.Codigo_Agente`})
    nombre:number
    
    comision:number
    faltante:number


    @OneToMany(()=>DetalleComision, (det)=>det.idRegistro,{cascade:true})
    detalles:DetalleComision[]    

    @AfterLoad()
    setData(){
        this.comision = ((this.cobranza/1.16)*(this.porcentaje/100))
        this.faltante = this.comision - this.anticipo - this.descuentos
    }
}