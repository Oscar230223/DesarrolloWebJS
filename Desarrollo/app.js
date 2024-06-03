const express = require("express");
const path = require("path");
const routes = require("./controllers/routes");
const rbd = require("./controllers/DB.rutas")
const bodyParser = require('body-parser');
const connectDb = require('./controllers/Config/DB');
const cors = require('cors');
const app = express();

connectDb();

//Middlewares
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.static("./public"));
app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "src", "views"));
app.use(express.static(path.join(__dirname, "src", "public")));



app.use("/", routes);
app.use("/", rbd);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});