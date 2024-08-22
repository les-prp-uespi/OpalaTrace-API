import { spawn } from "child_process";

interface ContaFF {
    address: string;
    privateKey: string;
}

export function criarContaFF(): Promise<{ address: string, privateKey: string }> {

    return new Promise((resolve) => {

        var comando = spawn('ff', ['accounts', 'create', 'dev']);

        let conta: ContaFF;

        comando.stdout.on('data', (output: string) => {
            console.log("Output: ", output.toString());
            conta = JSON.parse(output);
        });

        comando.stderr.on('data', (error: string) => {
            console.error("Error: ", error.toString());
        });

        comando.on('close', (code: string) => {
            console.log(`Command exited with code: ${code}`);
            resolve({
                address: conta.address,
                privateKey: conta.privateKey
            })
        });
    })

}