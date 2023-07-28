import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

@Module({
    imports:[
        ConfigModule.forRoot({
            isGlobal:true,
            envFilePath:'.env'
        }),
        TypeOrmModule.forRootAsync({
            inject:[ConfigService],
            useFactory:(config:ConfigService)=>{
                return{
                    type:'mssql',
                    host:`${config.get<string>('DB_SERVER')}\\${config.get<string>('instance_Name')}`,
                    port:config.get<number>('DB_PORT'),
                    username:config.get<string>('DB_USER'),
                    password:config.get<string>('DB_PASSWORD'),
                    database:config.get<string>('DB_NAME_CMP'),
                    synchronize:false,
                    entities:[],
                    logging:true,
                    options:{
                        trustServerCertificate:true
                    }
                }
            }
        })
    ]
})
export class CmpModule {}
