import { Entity, Column, PrimaryColumn, JoinColumn, ManyToOne, VirtualColumn } from "typeorm";
import Externo from "./externos.entity";

@Entity({name:'admDomicilios'})
export default class Domicilio{
    @PrimaryColumn({name:'CIDDIRECCION'})
    id:number
    
    @ManyToOne(() =>Externo, (externo)=>externo.domicilios)
    @JoinColumn({name:'CIDCATALOGO'})
    idCliente:number
    
    @Column({name:'CTIPOCATALOGO'})
    tipoCatalogo:number
    
    @Column({name:'CTIPODIRECCION'})
    tipoDireccion:number
    
    @Column({name:'CNOMBRECALLE'})
    calle:string
    
    @Column({name:'CNUMEROEXTERIOR'})
    exterior:string
    
    @Column({name:'CNUMEROINTERIOR'})
    interior:string
    
    @Column({name:'CCOLONIA'})
    colonia:string
    
    @Column({name:'CCODIGOPOSTAL'})
    codigoPostal:string
    
    @Column({name:'CTELEFONO1'})
    tel1:string
    
    @Column({name:'CTELEFONO2'})
    tel2:string
    
    @Column({name:'CTELEFONO3'})
    tel3:string
    
    @Column({name:'CTELEFONO4'})
    tel4:string
    
    @Column({name:'CEMAIL'})
    mail:string
    
    @Column({name:'CDIRECCIONWEB'})
    web:string
    
    @Column({name:'CPAIS'})
    pais:string
    
    @Column({name:'CESTADO'})
    estado:string
    
    @Column({name:'CCIUDAD'})
    ciudad:string
    
    @Column({name:'CTEXTOEXTRA'})
    txt:string
    
    @Column({name:'CTIMESTAMP'})
    timestamp:string
    
    @Column({name:'CMUNICIPIO'})
    municipio:string
    
    @Column({name:'CSUCURSAL'})
    sucursal:string

    setDom({calle, exterior, colonia, cp, municipio, estado, ciudad, pais, telefono}){
        this.calle = calle;
        this.exterior = exterior;
        this.colonia = colonia;
        this.codigoPostal = cp;
        this.municipio = municipio;
        this.estado = estado;
        this.ciudad = ciudad;
        this.pais = pais;
        this.tel1 = telefono;
    }
    
}