import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put } from '@nestjs/common';
import { ChargeService } from './charge.service';
import { CreateChargeDto } from './create-charge.dto';
import { UpdateChargeDto } from './update-charge.dto';

@Controller('charge')
export class ChargeController {
    
    constructor(private readonly charge: ChargeService) {}
    
    
    @Get()
    listar() {
        return this.charge.listar();
    }

    @Get(':id')
    async buscaPorCobrancaId(@Param('id') id: number) {
        return this.charge.buscaPorCobrancaId(id);
    }

    @Get('reserva/:id')
    async buscaPorReservaId(@Param('id', ParseIntPipe) reserva_id: number) {
        return this.charge.buscaPorReservaId(reserva_id);
    }

    @Post()
    criarCobranca(@Body() dto: CreateChargeDto) {
        return this.charge.criarCobranca(dto);
    }

    @Patch(':id') 
    atualizarCobranca(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateChargeDto){
        return this.charge.atualizarCobranca(id, dto);
    }

    @Delete(':id')
    removerCobranca(@Param('id', ParseIntPipe) id: number) {
        return this.charge.deletarCobranca(id);
    }
    
}
