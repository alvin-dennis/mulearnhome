/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: "no-deep-feature-imports",
      severity: "error",
      comment: "Import from a feature's barrel (index.ts), not its internals.",
      from: { pathNot: "^src/features/[^/]+/" },
      to: { path: "^src/features/[^/]+/(api|hooks|schemas|types|utils|components)/" },
    },
    {
      name: "no-deep-shared-imports",
      severity: "error",
      comment: "Import from shared's barrel (index.ts), not its internals.",
      from: { pathNot: "^src/shared/" },
      to: { path: "^src/shared/(api|hooks|schemas|types|components)/" },
    },
  ],
  options: {
    doNotFollow: { path: "node_modules" },
    tsPreCompilationDeps: true,
    tsConfig: { fileName: "tsconfig.json" },
    enhancedResolveOptions: {
      exportsFields: ["exports"],
      conditionNames: ["import", "require", "node", "default"],
    },
  },
};
