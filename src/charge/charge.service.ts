import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChargeDto } from './create-charge.dto';
import { Prisma } from '../generated/prisma/browser';
import { UpdateChargeDto } from './update-charge.dto';

@Injectable()
export class ChargeService {
    constructor(private readonly prisma: PrismaService) { }

    async criarCobranca(dto: CreateChargeDto) {
        try {

            const base = new Prisma.Decimal(dto.cobranca_valor_base);
            const adicional = new Prisma.Decimal(dto.cobranca_valor_adicional ?? 0);
            const desconto = new Prisma.Decimal(dto.cobranca_valor_desconto ?? 0);
            const total = (base.plus(adicional).minus(desconto));


            if (total.isNegative()) {
                throw new Error("O valor total da cobrança não pode ser negativo.");
            }

            const agora = new Date();

            return await this.prisma.charge.create({

                data: {
                    reserva_id: dto.reserva_id,
                    cobranca_valor_base: base,
                    cobranca_valor_adicional: adicional,
                    cobranca_valor_desconto: desconto,
                    cobranca_valor_total: total,
                    cobranca_criado: agora,
                    cobranca_atualizado: agora,
                    cobranca_status: 0,
                },

            });

        } catch (erro) {
            throw (erro);

        }
    }

    listar() {
        return this.prisma.charge.findMany({
            where:{
                cobranca_status: {
                    not: 2
                }
            },
            orderBy: { 
                reserva_id: 'asc' 
            } 
        });
    }

    async buscaPorCobrancaId(id: number) {

        const cobrancaPorId = await this.prisma.charge.findUnique({
            where: {
                cobranca_id: id,
            },

        });

        if (!cobrancaPorId) {
            throw new NotFoundException('Não existem cobranças com ID ${id} cadastradas');
        }
        return cobrancaPorId;
    }

    async buscaPorReservaId(id: number) {

        const reservaPorId = await this.prisma.charge.findMany({
            where: {
                reserva_id: BigInt(id),
            },

        });

        if (reservaPorId.length === 0) {
            throw new NotFoundException('Não existem cobranças com reserva ID ${id} cadastradas');
        }
        return reservaPorId;
    }

    async atualizarCobranca(id: number, dto: UpdateChargeDto) {

        try {
            const cobranca = await this.buscaPorCobrancaId(id);

            const base = new Prisma.Decimal(dto.cobranca_valor_base ?? cobranca.cobranca_valor_base);
            const adicional = new Prisma.Decimal(dto.cobranca_valor_adicional! ?? cobranca.cobranca_valor_adicional);
            const desconto = new Prisma.Decimal(dto.cobranca_valor_desconto! ?? cobranca.cobranca_valor_desconto);
            const total = (base.plus(adicional).minus(desconto));

            if (total.isNegative()) {
                throw new Error("O valor total da cobrança não pode ser negativo.");
            }

            const agora = new Date();

            return this.prisma.charge.update({
                where: {
                    cobranca_id: id,
                },
                data: {
                    reserva_id: cobranca.reserva_id,
                    cobranca_valor_base: base,
                    cobranca_valor_adicional: adicional,
                    cobranca_valor_desconto: desconto,
                    cobranca_valor_total: total,
                    cobranca_atualizado: agora,
                    cobranca_status: dto.cobranca_status ?? cobranca.cobranca_status,
                },
            });
        } catch (erro) {
            throw (erro);
        }


    }


    async deletarCobranca(id: number) {
        const cobranca = await this.buscaPorCobrancaId(id);

        if (cobranca.cobranca_status === 2) {
            throw new BadRequestException("Esta cobrança já foi excluída e cancelada.");
        }

        return this.prisma.charge.update({
            where: {

                cobranca_id: id,
            },
            data: {
                cobranca_status: 2,
                cobranca_atualizado: new Date(),

            }
        });
    }

}
