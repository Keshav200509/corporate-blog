const optionalPlugin = (name) => {
  try {
    require.resolve(name);
    return { [name]: {} };
  } catch {
    console.warn(`${name} package not found; skipping ${name} PostCSS plugin for this build.`);
    return {};
  }
};

module.exports = {
  plugins: {
    ...optionalPlugin("tailwindcss"),
    ...optionalPlugin("autoprefixer")
  }
};
