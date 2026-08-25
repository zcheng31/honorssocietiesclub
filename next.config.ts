import type { NextConfig } from 'next';

const isGitHubPages = process.env.GITHUB_PAGES === 'true';
const repositoryName = process.env.GITHUB_PAGES_REPOSITORY ?? 'honorssocietiesclub';
const basePath = isGitHubPages ? `/${repositoryName}` : '';

const nextConfig: NextConfig = {
  output: isGitHubPages ? 'export' : undefined,
  basePath,
  assetPrefix: basePath,
  trailingSlash: isGitHubPages,
  images: { unoptimized: true },
};

export default nextConfig;
