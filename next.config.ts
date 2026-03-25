import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'protobufjs': false,
        'protobufjs/google/protobuf/api.json': false,
        'protobufjs/google/protobuf/descriptor.json': false,
        'protobufjs/google/protobuf/empty.json': false,
        'protobufjs/google/protobuf/wrappers.json': false,
        'protobufjs/google/protobuf/source_context.json': false,
        'protobufjs/google/protobuf/type.json': false,
        'protobufjs/google/protobuf/struct.json': false,
        'protobufjs/google/protobuf/timestamp.json': false,
        '@grpc/grpc-js': false,
        'worker_threads': false,
        'fs': false,
        'path': false,
      };
    }
    return config;
  },
};

export default nextConfig;
