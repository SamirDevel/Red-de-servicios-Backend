import { Module, MiddlewareConsumer } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import { CreditoCobranzaService } from './credito.cobranza.service';
import { DocumentosService } from 'src/Servicios/Servicos_CORP/documentos/documentos.service';
import { ClientesService } from 'src/Servicios/Servicos_CORP/clientes/clientes.service';
import { CreditoCobranzaController } from './credito.cobranza.controller';
import { DomiciliosService } from 'src/Servicios/Servicos_CORP/domicilios/domicilios.service';
import entidadesList from 'src/entidades/entidadesCORP';
import { VentasService } from 'src/Servicios/Servicos_Desarrollo/ventas/ventas.service';
import { UsuariosService } from 'src/Servicios/Servicos_Desarrollo/usuarios/usuarios.service';
import { ViajesService } from 'src/Servicios/Servicos_Desarrollo/viajes/viajes.service';
import entidadesViajes from 'src/entidades/entidadesDesarrollos/Viajes';
import entidadesCuentas from 'src/entidades/entidadesDesarrollos/Cuentas';
import { BitacoraService } from 'src/servicios/servicos_desarrollo/bitacora/bitacora.service';
import entidadesBitacora from 'src/entidades/entidadesDesarrollos/Bitacora';
import { BitacoraModule } from 'src/Servicios/Servicos_Desarrollo/bitacora/bitacora.module';
import { AgenteDesService } from 'src/servicios/servicos_desarrollo/agente-des/agente-des.service';
import { ChoferService } from 'src/Servicios/Servicos_Desarrollo/viajes/chofer/chofer.service';
import { VehiculoService } from 'src/Servicios/Servicos_Desarrollo/viajes/vehiculo/vehiculo.service';
import { FacturaCerradaService } from 'src/Servicios/Servicos_Desarrollo/viajes/factura_cerrada/factura_cerrada.service';

@Module({
  imports:[
    TypeOrmModule.forFeature(entidadesList,'cdc'),
    TypeOrmModule.forFeature(entidadesList,'cmp'),
    TypeOrmModule.forFeature([...entidadesBitacora],'bitacora'),
    TypeOrmModule.forFeature([...entidadesViajes],'viajes'),
    TypeOrmModule.forFeature([...entidadesCuentas],'cuentas'),
    BitacoraModule
  ],
  providers: [
    CreditoCobranzaService, 
    DocumentosService, 
    ClientesService, 
    DomiciliosService,
    VentasService,
    UsuariosService,
    BitacoraService,
    ChoferService,
    VehiculoService,
    ViajesService,
    AgenteDesService,
    FacturaCerradaService
  ],
  exports:[BitacoraService],
  controllers: [CreditoCobranzaController]
})
export class CreditoCobranzaModule {
  configure(consumer:MiddlewareConsumer){
  }
}
