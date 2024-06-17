export default () => ({
  PORT: parseInt(process.env.PORT),
  SECRET: process.env.SECRET,
  DOMAIN: process.env.DOMAIN,
});
