import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	reactCompiler: true,
	env: {
		SKIP_PROCESS_EXIT_CHECK: "true",
	},
	// Empty turbopack config to allow webpack config
	turbopack: {},
	// Externalize packages that have issues with bundling
	serverExternalPackages: ["pino", "pino-pretty"],
	webpack: (config, { isServer }) => {
		// Exclude test files from being bundled
		config.module.rules.push({
			test: /\.test\.(js|ts|jsx|tsx)$/,
			loader: "ignore-loader",
		});

		// Ignore problematic modules
		config.resolve.alias = {
			...config.resolve.alias,
			"pino-pretty": false,
			encoding: false,
		};

		// Externalize Node.js built-ins for client-side
		if (!isServer) {
			config.resolve.fallback = {
				...config.resolve.fallback,
				fs: false,
				net: false,
				tls: false,
				crypto: false,
				stream: false,
				http: false,
				https: false,
				zlib: false,
				path: false,
				os: false,
			};
		}

		// Ignore missing modules that are test dependencies
		config.ignoreWarnings = [
			{ module: /node_modules\/thread-stream\/test/ },
			{ module: /node_modules\/pino\/test/ },
		];

		return config;
	},
};

export default nextConfig;
