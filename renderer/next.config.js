module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.target = "electron-renderer";
      // config.node = {
      //   fs: "empty",
      // };
    }

    return config;
  },
};
