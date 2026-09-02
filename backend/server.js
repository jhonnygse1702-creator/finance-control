const app = require("./src/app");

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`FinanceControl API rodando na porta ${PORT}`);
});