import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import entidadesList from 'src/entidades/entidadesCORP';
import entidadesCuentas from 'src/entidades/entidadesDesarrollos/Cuentas';
import entidadesViajes from 'src/entidades/entidadesDesarrollos/Viajes';
import ComisionesEntities from 'src/entidades/entidadesDesarrollos/Comisiones';
import AlmacenList from 'src/entidades/entidadesDesarrollos/Almacen';
import entidadesBitacora from 'src/entidades/entidadesDesarrollos/Bitacora';
const responseTime = 1920000;
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
        logging:false,
        options:{
            trustServerCertificate:true,
            connectTimeout: responseTime,
            requestTimeout: responseTime,
            timeout: responseTime,
            maxQueryExecutionTime:responseTime,
            poolSize:1,
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
            name:'cuentas',
            inject:[ConfigService],
            useFactory:(config:ConfigService)=>{
                return dbsConfig('DB_NAME_CUENTAS',config, entidadesCuentas);
            }
        }),
        TypeOrmModule.forRootAsync({
            name:'viajes',
            inject:[ConfigService],
            useFactory:(config:ConfigService)=>{
                return dbsConfig('DB_NAME_VIAJES',config, entidadesViajes);
            }
        }),
        TypeOrmModule.forRootAsync({
            name:'alm',
            inject:[ConfigService],
            useFactory:(config:ConfigService)=>{
                return dbsConfig('DB_NAME_ALM',config, AlmacenList);
            }
        }),
        TypeOrmModule.forRootAsync({
            name:'comisiones',
            inject:[ConfigService],
            useFactory:(config:ConfigService)=>{
                return dbsConfig('DB_NAME_COMISIONES',config, ComisionesEntities);
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
        }),
        TypeOrmModule.forRootAsync({
            name:'bitacora',
            inject:[ConfigService],
            useFactory:(config:ConfigService)=>{
                return dbsConfig('DB_NAME_BITACORA',config, entidadesBitacora);
            }
        })
    ]
})
export class ORMModule {}
