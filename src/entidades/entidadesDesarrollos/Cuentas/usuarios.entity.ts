import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn} from 'typeorm';
import Areas from './areas.entity';

@Entity({name: 'Usuarios'})
export default class Usuarios{
    
    @PrimaryGeneratedColumn({type:'integer', name:'Id'})
    id:number;

    @Column({name:'Usuario'})
    usuario:string;

    @Column({name:'Nombre'})
    nombre:string;
    
    @Column({name:'Psw'})
    psw:string;

    @ManyToOne(()=>Areas, area=>area.usuarios)
    @JoinColumn({name:'Id_Area'})
    idArea:Areas;

    @Column({name:'Registro'})
    fechaRegistro:Date;

    @Column({name:'Estatus'})
    estatus:string;

    @Column({name:'registrado_Por'})
    registradoPor:string;

}