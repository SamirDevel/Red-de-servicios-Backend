import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity({name:'admAgentes'})
export default class Agente{
    @PrimaryColumn({name:'CIDAGENTE'})
    id:number
    
    @Column({name:'CCODIGOAGENTE'})
    codigo:string
    
    @Column({name:'CNOMBREAGENTE'})
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
}