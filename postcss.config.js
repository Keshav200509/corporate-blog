
let hasTailwind = true;
let hasAutoprefixer = true;

try {
  require.resolve("tailwindcss");
} catch {
  hasTailwind = false;
  console.warn("tailwindcss package not found; skipping tailwindcss PostCSS plugin for this build.");
}

try {
  require.resolve("autoprefixer");
} catch {
  hasAutoprefixer = false;
  console.warn("autoprefixer package not found; skipping autoprefixer PostCSS plugin for this build.");
}

module.exports = {
  plugins: {
    ...(hasTailwind ? { tailwindcss: {} } : {}),
    ...(hasAutoprefixer ? { autoprefixer: {} } : {})
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
};
