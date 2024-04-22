import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import Usuarios from 'src/entidades/entidadesDesarrollos/Cuentas/usuarios.entity';
import Areas from 'src/entidades/entidadesDesarrollos/Cuentas/areas.entity';
interface filros{
    id:number
    usuario:string
    nombre:string
}
@Injectable()
export class UsuariosService {
    constructor(
        @InjectRepository(Usuarios, 'cuentas') private repoUsuarios:Repository<Usuarios>,
        @InjectRepository(Areas, 'cuentas') private repoAreas:Repository<Areas>,
    ){ }
    
    async crear(usuario: string, psw:string){
        const nuevousuario = this.repoUsuarios.create({usuario, psw});
        //console.log(nuevousuario);

        return await this.repoUsuarios.save(nuevousuario);
    }

    async list(area?:string){
        const lista = this.repoUsuarios.createQueryBuilder('usr')
            .select('usr.usuario')
            .addSelect('usr.nombre')
        if(area!== undefined){
            lista.andWhere('area.codig = :area', {area})
                .addSelect('area.area')
                .leftJoin('usr.idArea', 'area');
        }
        return await lista.getMany();
    }

    async getUser(usuario:string, psw:string){
        return  await this.repoUsuarios.createQueryBuilder('us').select('us.id')
            .addSelect('us.usuario')
            .andWhere('us.usuario = :u AND us.psw = :p', {u:usuario, p:psw}).getOne();
    }
    async getUserByfilter(filtros:Partial<filros>){
        const query = this.repoUsuarios.createQueryBuilder('us').select('us.id')
            .addSelect('us.usuario')
            .addSelect('us.nombre')
        if(filtros.usuario!==undefined)query.andWhere('us.usuario = :u', {u:filtros.usuario})
        if(filtros.nombre!==undefined)query.andWhere('us.nombre = :n', {n:filtros.usuario})
        if(filtros.id!==undefined)query.andWhere('us.id = :id', {id:filtros.id})
        return query.getOne();
    }
    async getUserArea(id:number){
        return  await this.repoUsuarios.createQueryBuilder('user').select('user.id')
            .addSelect('area.codigo')
            .addSelect('area.area')
            .leftJoin('user.idArea', 'area')
            .andWhere('user.id = :u ', {u:id}).getOne();
    }
}
