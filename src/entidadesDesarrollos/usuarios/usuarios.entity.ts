import {Entity, Column, PrimaryColumn} from 'typeorm';

@Entity({
    name: 'Usuarios'
})
export default class UsuarioEntity{
    
    @PrimaryColumn({type:'integer', name:'Id'})
    id:number;
    @Column({name:'Usuario'})
    usuario:string;
    
    @Column({name:'Contraseña'})
    psw:string;
}