import typescript from 'rollup-plugin-typescript2';
import replace from "@rollup/plugin-replace";
import pkg from './package.json';
import path from 'path';

const override = { compilerOptions: { declarationDir: path.dirname(pkg.typings) } };
const banner = `/*\n\tPIXI v5 Tiled support lib, version ${pkg.version}\n\tAuthor: ${pkg.author} \n*/`;

export default [
	{
		input: pkg.source || './src/index.ts',
		plugins: [
			typescript({
				useTsconfigDeclarationDir: true,
				tsconfig: 'tsconfig.json',
				tsconfigOverride: override,
			}),
			replace( {
				__VERSION__: pkg.version
			})
		],
		external: ['pixi.js'],
		
		output: [
			{
				file: pkg.main,
				format: 'cjs',
				banner
			},
			{
				file: pkg.module,
				format: 'esm',
				banner
			},
			{
				file: pkg['iife:main'],
				format: 'iife',
				name: pkg['iife:name'],
				globals: {
					'pixi.js': 'PIXI',
				},
				banner,
				footer: `\n// Inject to PIXI namespace \n PIXI["${pkg['iife:name']}"] = ${pkg['iife:name']};\n`
			},
		],
	},
];
