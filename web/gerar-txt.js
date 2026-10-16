const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const OUTPUT = 'projeto-completo.txt';
const EXTENSOES = ['.ts', '.tsx', '.js', '.jsx', '.css', '.prisma', '.json', '.md'];
const IGNORAR = ['node_modules', '.next', '.git', 'package-lock.json', 'projeto-completo.txt'];

let resultado = '';

function varrer(dir) {
  const itens = fs.readdirSync(dir);
  for (const item of itens) {
    if (IGNORAR.some(i => item.includes(i))) continue;
    const caminho = path.join(dir, item);
    const stat = fs.statSync(caminho);
    
    if (stat.isDirectory()) {
      varrer(caminho);
    } else {
      const ext = path.extname(item);
      if (!EXTENSOES.includes(ext)) continue;
      
      const relativo = caminho.replace(ROOT, '');
      try {
        const conteudo = fs.readFileSync(caminho, 'utf8');
        resultado += `\n\n========================================\n`;
        resultado += `=== ARQUIVO: ${relativo} ===\n`;
        resultado += `========================================\n\n`;
        resultado += conteudo;
      } catch (e) {
        console.log(`Erro ao ler: ${relativo}`);
      }
    }
  }
}

varrer(ROOT);
fs.writeFileSync(OUTPUT, resultado, 'utf8');
console.log(`✅ Pronto! Arquivo ${OUTPUT} gerado.`);
console.log(`📦 Tamanho: ${(resultado.length / 1024).toFixed(1)} KB`);