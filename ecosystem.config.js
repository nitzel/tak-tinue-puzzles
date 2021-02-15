module.exports = {
  apps: [{
    name: "Tak Tinue Puzzles",
    script: "npm run build && npm run start",
    env: {
      NODE_ENV: "production",
    },
  }],
};
