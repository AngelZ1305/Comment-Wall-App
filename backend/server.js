const app = require("./src/app");
const { PORT } = require("./src/config");

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
