import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import entidadesDesList from 'src/entidadesDesarrollos';
import entidadesList from 'src/entidades';

function dbsConfig(dbname:string, config:ConfigService, list:[]){
    type dbtype ='mssql'
    const myType:dbtype = 'mssql'
    return{
        type:myType,
        host:`${config.get<string>('DB_SERVER')}\\${config.get<string>('instance_Name')}`,
        port:config.get<number>('DB_PORT'),
        username:config.get<string>('DB_USER'),
        password:config.get<string>('DB_PASSWORD'),
        database:config.get<string>(dbname),
        synchronize:false,
        entities:list,
        logging:true,
        options:{
            trustServerCertificate:true
        }
    }
}

@Module({
    imports:[
        ConfigModule.forRoot({
            isGlobal:true,
            envFilePath:'.env'
        }),
        TypeOrmModule.forRootAsync({
            inject:[ConfigService],
            useFactory:(config:ConfigService)=>{
                return dbsConfig('DB_NAME_DES',config, entidadesDesList);
            }
        }),   
        TypeOrmModule.forRootAsync({
            name:'cdc',
            inject:[ConfigService],
            useFactory:(config:ConfigService)=>{
                return dbsConfig('DB_NAME_CDC',config, entidadesList);
            }
        }),
        TypeOrmModule.forRootAsync({
            name:'cmp',
            inject:[ConfigService],
            useFactory:(config:ConfigService)=>{
                return dbsConfig('DB_NAME_CMP',config, entidadesList);
            }
        })
    ]
})
export class ORMModule {}
