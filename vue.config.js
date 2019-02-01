module.exports = {
  assetsDir: 'assets',
  lintOnSave: undefined,
  css: {
    loaderOptions: {
      sass: {
        data: '@import "@/styles/colors.scss";@import "@/styles/global.scss";@import "@/styles/effects.scss";',
      },
    },
  },
};
