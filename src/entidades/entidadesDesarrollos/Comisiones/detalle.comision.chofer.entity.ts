import {Entity, Column, JoinColumn, PrimaryGeneratedColumn, OneToOne, ManyToOne, VirtualColumn
    , AfterLoad} from 'typeorm';
    import RegistroComisionChofer from './registro.comision.chofer.entity';
    
    @Entity({name:'Detalle_Comision_Chofer'})
    export default class DetalleComisionChofer{
        @PrimaryGeneratedColumn({name:'Id'})
        id:number;
    
        @JoinColumn({name:'Id_Registro_Chofer'})
        @ManyToOne(()=>RegistroComisionChofer, reg=>reg.detalles)
        idRegistro:RegistroComisionChofer
    
        @Column({name:'Serie_Viaje'})
        serie:string
    
        @Column({name:'Folio_Viaje'})
        folio:number
    
        @Column({name:'Tipo_Ruta'})
        tipoRuta:number
    }