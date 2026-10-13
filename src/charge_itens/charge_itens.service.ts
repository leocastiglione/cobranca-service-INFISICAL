import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChargeItemDto } from './create-charge_itens.dto';
import { Prisma } from '../generated/prisma/client';
import { UpdateChargeItemDto } from './update-charge_itens.dto';

@Injectable()
export class ChargeItensService {
    constructor(private readonly prisma: PrismaService) { }

    async criarItemCobranca(dto: CreateChargeItemDto) {
        try {
            const cobranca = await this.prisma.charge.findUnique({
                where: {
                    cobranca_id: BigInt(dto.cobranca_id),
                },
            });

            if (!cobranca) {
                throw new NotFoundException(`Cobrança com ID ${dto.cobranca_id} não encontrada.`);
            }

            const valor_unitario = new Prisma.Decimal(dto.item_cobranca_valor_unitario ?? 0);
            const quantidade = new Prisma.Decimal(dto.item_cobranca_quantidade ?? 0);
            const valor_total = valor_unitario.mul(quantidade);

            return this.prisma.charge_item.create({
                data: {

                    cobranca_id: BigInt(dto.cobranca_id),

                    item_cobranca_tipo: dto.item_cobranca_tipo,

                    item_cobranca_descricao: dto.item_cobranca_descricao,

                    item_cobranca_quantidade: dto.item_cobranca_quantidade,

                    item_cobranca_valor_unitario: dto.item_cobranca_valor_unitario,

                    item_cobranca_valor_total: valor_total,

                    item_cobranca_criado: new Date(),

                    item_cobranca_status: 0

                }
            })
        } catch (error) {
            throw (error);
        }
    }

    listar() {
        return this.prisma.charge_item.findMany({
            where: {
                item_cobranca_status: {
                    not: 2
                }
            },
            orderBy: {
                item_cobranca_id: 'asc'
            }
        });
    }


    async buscarPorItensId(id: number) {

        const itensPorId = await this.prisma.charge_item.findUnique({
            where: {
                item_cobranca_id: id,
            },

        });

        if (!itensPorId) {
            throw new NotFoundException('Não existem cobranças com ID ${id} cadastradas');
        }
        return itensPorId;
    }


    async buscaItensPorCobrancaId(id: number) {

        const cobrancaPorId = await this.prisma.charge.findMany({
            where: {
                cobranca_id: id,
            },

        });

        if (cobrancaPorId.length === 0) {
            throw new NotFoundException('Não existem cobranças com ID ${id} cadastradas');
        }
        return cobrancaPorId;
    }

    async atualizarItemCobranca(id: number, dto: UpdateChargeItemDto) {

        try {
            const item_cobranca = await this.buscarPorItensId(id);


            const valor_unitario = new Prisma.Decimal(dto.item_cobranca_valor_unitario ?? 0);
            const quantidade = new Prisma.Decimal(dto.item_cobranca_quantidade ?? 0);
            const valor_total = valor_unitario.mul(quantidade);

            if (valor_total.isNegative()) {
                throw new Error("O valor total da cobrança não pode ser negativo.");
            }

            return this.prisma.charge_item.update({
                where: {
                    item_cobranca_id: id,
                },
                data: {
                    
                    cobranca_id: dto.cobranca_id,

                    item_cobranca_tipo: dto.item_cobranca_tipo,

                    item_cobranca_descricao: dto.item_cobranca_descricao,

                    item_cobranca_quantidade: dto.item_cobranca_quantidade,

                    item_cobranca_valor_unitario: dto.item_cobranca_valor_unitario,

                    item_cobranca_valor_total: valor_total,

                    item_cobranca_criado: dto.item_cobranca_criado,

                    item_cobranca_status: dto.item_cobranca_status 
                },
            });
        } catch (erro) {
            throw (erro);
        }

    }


    async deletarItemCobranca(id: number) {
        
        const item_cobranca = await this.buscarPorItensId(id);

        if (item_cobranca.item_cobranca_status === 2) {
            throw new BadRequestException("Este item de cobrança já foi excluído.");
        }

        return this.prisma.charge_item.update({
            where: {

                item_cobranca_id: id,
            },
            data: {
                item_cobranca_status: 2,                

            }
        });
    }

}
