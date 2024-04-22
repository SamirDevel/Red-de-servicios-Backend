import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from 'typeorm';
import Usuarios from './usuarios.entity';

@Entity({name: 'Areas'})
export default class Areas{
    
    @PrimaryGeneratedColumn({type:'integer', name:'Id'})
    id:number;

    @Column({name:'Area'})
    area:string;
    
    @Column({name:'Codigo'})
    codigo:string;

    @OneToMany(()=>Usuarios, user=>user.idArea)
    usuarios:Usuarios[]
}