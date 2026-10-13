import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './create-payment.dto';
import { Prisma } from '../generated/prisma/browser';
import { UpdatePaymentDto } from './update-payment.dto';

@Injectable()

export class PaymentService {
    constructor(private readonly prisma: PrismaService) { }

    async criarPagamento(dto: CreatePaymentDto) {
        const cobranca = await this.prisma.charge.findUnique({
            where: {
                cobranca_id: BigInt(dto.cobranca_id),
            },
        });

        if (!cobranca) {
            throw new NotFoundException(`Cobrança com ID ${dto.cobranca_id} não encontrada.`);
        }

        return this.prisma.payment.create({
            data: {
                usuario_id: dto.usuario_id != null ? BigInt(dto.usuario_id) : undefined,

                cobranca_id: BigInt(dto.cobranca_id),

                pagamento_forma: dto.pagamento_forma,

                pagamento_valor: dto.pagamento_valor != null ? new Prisma.Decimal(dto.pagamento_valor) : undefined,

                pagamento_pago_em: dto.pagamento_pago_em != null ? new Date(dto.pagamento_pago_em) : undefined,

                pagamento_transacao_externa_id: dto.pagamento_transacao_externa_id,

                pagamento_status: dto.pagamento_status,

            }
        })
    }

    lista() {
        return this.prisma.payment.findMany({
            where: {
                pagamento_status: {
                    not: 2,
                },
            },
            orderBy: {
                pagamento_id: 'asc',
            },
        });
    }

    async buscaPorPagamentoId(id: number) {
        const pagamento = await this.prisma.payment.findUnique({
            where: {
                pagamento_id: BigInt(id),
            },
        });

        if (!pagamento) {
            throw new NotFoundException(`Pagamento com ID ${id} não encontrado.`);
        }

        return pagamento;
    }

    async buscarPorCobrancaId(cobranca_id: number) {
        const pagamentos = await this.prisma.payment.findMany({
            where: {
                cobranca_id: BigInt(cobranca_id),
                pagamento_status: {
                    not: 2,
                },
            },
            orderBy: {
                pagamento_id: 'asc',
            },
        });

        if (pagamentos.length === 0) {
            throw new NotFoundException(`Não foi encontrado pagamento para a cobrança com ID ${cobranca_id}`);
        }
        return pagamentos;
    }

    async atualizarPagamento(id: number, dto: UpdatePaymentDto) {
        const pagamento = await this.buscaPorPagamentoId(id);

        if (pagamento.pagamento_status === 2) {
            throw new BadRequestException('Não é possível atualizar um pagamento excluído.');
        }

        if (dto.cobranca_id !== undefined) {
            const cobranca = await this.prisma.charge.findUnique({
                where: {
                    cobranca_id: BigInt(dto.cobranca_id),
                },
            });

            if (!cobranca) {
                throw new NotFoundException(
                    `Cobrança com ID ${dto.cobranca_id} não encontrada.`,
                );
            }
        }

        return this.prisma.payment.update({
            where: {
                pagamento_id: BigInt(id),
            },
            data: {
                usuario_id: dto.usuario_id !== undefined ? dto.usuario_id === null ? null : BigInt(dto.usuario_id) : undefined,

                cobranca_id: dto.cobranca_id !== undefined ? BigInt(dto.cobranca_id) : undefined,

                pagamento_forma: dto.pagamento_forma,

                pagamento_valor: dto.pagamento_valor !== undefined ? dto.pagamento_valor === null ? null : new Prisma.Decimal(dto.pagamento_valor) : undefined,

                pagamento_pago_em: dto.pagamento_pago_em !== undefined ? dto.pagamento_pago_em === null ? null : new Date(dto.pagamento_pago_em) : undefined,

                pagamento_transacao_externa_id: dto.pagamento_transacao_externa_id,

                pagamento_status: dto.pagamento_status,
            },
        });
    }

    async removerPagamento(id: number) {
        const pagamento = await this.buscaPorPagamentoId(id);

        if (pagamento.pagamento_status === 2) {
            throw new BadRequestException(
                'Este pagamento já foi excluído.',
            );
        }

        return this.prisma.payment.update({
            where: {
                pagamento_id: BigInt(id),
            },
            data: {
                pagamento_status: 2,
            },
        });
    }
}
