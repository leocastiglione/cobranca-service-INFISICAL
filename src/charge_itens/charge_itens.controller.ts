import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ChargeItensService } from './charge_itens.service';
import { CreateChargeItemDto } from './create-charge_itens.dto';
import { UpdateChargeItemDto } from './update-charge_itens.dto';

@Controller('charge-itens')
export class ChargeItensController {

    constructor(private readonly charge_itens: ChargeItensService) { }


    @Get()
    listar() {
        return this.charge_itens.listar();
    }

    @Get('cobranca/:id')
    async buscaPorCobrancaId(@Param('id') id: number) {
        return this.charge_itens.buscaItensPorCobrancaId(id);
    }

    @Get(':id')
    async buscaPorItemId(@Param('id', ParseIntPipe) item_cobranca_id: number) {
        return this.charge_itens.buscarPorItensId(item_cobranca_id);
    }

    @Post()
    criarItemCobranca(@Body() dto: CreateChargeItemDto) {
        return this.charge_itens.criarItemCobranca(dto);
    }

    @Patch(':id')
    atualizarItemCobranca(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateChargeItemDto) {
        return this.charge_itens.atualizarItemCobranca(id, dto);
    }

    @Delete(':id')
    removerItemCobranca(@Param('id', ParseIntPipe) id: number) {
        return this.charge_itens.deletarItemCobranca(id);
    }





}
