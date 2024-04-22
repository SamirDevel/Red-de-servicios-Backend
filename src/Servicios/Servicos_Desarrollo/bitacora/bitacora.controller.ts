import { Controller, Get } from '@nestjs/common';
import { BitacoraService } from './bitacora.service';

@Controller('bitacora')
export class BitacoraController {
    constructor(
        private bitService:BitacoraService
    ){}

    async getMotivos(){
        
    }

}
