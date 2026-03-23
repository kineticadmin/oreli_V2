const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');
const fs = require('fs');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// Watch monorepo root so Metro sees packages/* and node_modules
config.watchFolders = [monorepoRoot];

// Resolve modules from app first, then monorepo root (pnpm hoist)
config.resolver.nodeModulesPaths = [
    path.resolve(projectRoot, 'node_modules'),
    path.resolve(monorepoRoot, 'node_modules'),
];

// pnpm symlinks: allow Metro to follow symlinks outside watchFolders
config.resolver.unstable_enableSymlinks = true;

// Canonical React paths — resolve via pnpm store, NOT the hoisted copy at
// monorepo root (which is a DIFFERENT physical file despite same version).
// pnpm creates two separate React@19 copies: one in .pnpm store (used by mobile)
// and one hoisted at root node_modules (used by Next.js apps).
// Metro would bundle both, causing two React instances → "Invalid hook call".
const reactPnpmDir = path.dirname(
    fs.realpathSync(
        require.resolve('react/package.json', { paths: [projectRoot] })
    )
);

// Force every require('react') — from any package in the monorepo — to
// resolve to the single pnpm store instance used by the mobile app.
config.resolver.resolveRequest = (context, moduleName, platform) => {
    if (moduleName === 'react') {
        return { filePath: path.join(reactPnpmDir, 'index.js'), type: 'sourceFile' };
    }
    if (moduleName === 'react/jsx-runtime') {
        return { filePath: path.join(reactPnpmDir, 'jsx-runtime.js'), type: 'sourceFile' };
    }
    if (moduleName === 'react/jsx-dev-runtime') {
        return { filePath: path.join(reactPnpmDir, 'jsx-dev-runtime.js'), type: 'sourceFile' };
    }
    return context.resolveRequest(context, moduleName, platform);
};

// Block the hoisted react at monorepo root from being bundled.
// pnpm hoists a physically separate React@19 copy there for Next.js apps.
// Blocking it forces Metro to only use the pnpm store react via resolveRequest.
const hoistedReactDir = path.join(monorepoRoot, 'node_modules', 'react');
const BLOCK_HOISTED_REACT = new RegExp(
    `^${hoistedReactDir.replace(/\//g, '\\/')}($|[/\\\\].*)`
);
const existingBlockList = config.resolver.blockList;
if (!existingBlockList) {
    config.resolver.blockList = BLOCK_HOISTED_REACT;
} else if (Array.isArray(existingBlockList)) {
    config.resolver.blockList = [...existingBlockList, BLOCK_HOISTED_REACT];
} else {
    config.resolver.blockList = [existingBlockList, BLOCK_HOISTED_REACT];
}

module.exports = config;
