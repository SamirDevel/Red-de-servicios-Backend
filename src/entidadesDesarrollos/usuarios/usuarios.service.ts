import { Injectable } from '@nestjs/common';
import { Repository, Not } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import UsuarioEntity from './usuarios.entity';

@Injectable()
export class UsuariosService {
    constructor(@InjectRepository(UsuarioEntity) private repo:Repository<UsuarioEntity>){ }
    
    async crear(usuario: string, psw:string){
        const id = await this.repo.count() +1;
        console.log(id);
        const nuevousuario = this.repo.create({id, usuario, psw});
        //console.log(nuevousuario);

        return this.repo.save(nuevousuario);
    }

    async list(){
        const lista = await this.repo.find();
        return lista;
    }
}
