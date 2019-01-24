module.exports = {
  assetsDir: 'assets',
  lintOnSave: undefined,
  css: {
    loaderOptions: {
      sass: {
        data: '@import "@/styles.scss";',
      },
    },
  },
};
