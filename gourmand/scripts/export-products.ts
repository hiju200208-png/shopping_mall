import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { products } from '../data/products';

const outDir = join(process.cwd(), '..', 'backend', 'seed');
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'products.json'), JSON.stringify(products, null, 2), 'utf-8');

console.log(`✅ 상품 ${products.length}개를 backend/seed/products.json으로 내보냈습니다.`);