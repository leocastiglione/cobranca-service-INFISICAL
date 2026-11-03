import { readFileSync } from 'node:fs';

function readSecret(name: string): string | undefined {
    const filePath = process.env[`${name}_FILE`];

    if (filePath) {
        return readFileSync(filePath, 'utf8')
            .replace(/\r?\n$/, '');
    }

    // Permite continuar usando variaveis normais
    // durante desenvolvimento local.
    return process.env[name];
}

export default () => ({
    DB_USUARIO: readSecret('DB_USUARIO'),
    DB_USUARIO_SENHA: readSecret('DB_USUARIO_SENHA'),
    COBRANCA: readSecret('COBRANCA'),
    JWT_SECRET: readSecret('JWT_SECRET'),
});
