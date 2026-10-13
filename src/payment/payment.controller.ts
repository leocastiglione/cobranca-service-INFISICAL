import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './create-payment.dto';
import { UpdatePaymentDto } from './update-payment.dto';

@Controller('payment')
export class PaymentController {
    constructor (private readonly paymentService: PaymentService) {}

    @Get()
    listar(){
        return this.paymentService.lista();
    }

    @Get('cobranca/:id')
    buscarPorCobrancaId(@Param('id', ParseIntPipe) id: number){
        return this.paymentService.buscarPorCobrancaId(id);
    }
    
    @Post()
    criarPagamento(@Body() dto: CreatePaymentDto){

        return this.paymentService.criarPagamento(dto);

    }

    @Patch(':id')
    atualizarPagamento ( @Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePaymentDto) {
        return this.paymentService.atualizarPagamento(id, dto);

    }

    @Delete(':id')
    removerPagamento(@Param('id', ParseIntPipe) id:number) {
        return this.paymentService.removerPagamento(id);
    }

}
