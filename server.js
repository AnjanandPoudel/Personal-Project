const http = require("http");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
const {connectDB} = require("./config/db");

//swagger doc setup
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./helpers/swagger/swagger_output.json");

// dotenv configure
dotenv.config({
  path: "./config/.env",
});

//routes declaration
const ApiRouter = require("./mainRouter");
const { failCase, SuccessCase } = require("./utils/requestHandler");
const { emailInitialSetup } = require("./v1/utils/mail");

//database
connectDB();

emailInitialSetup();

//CORS
app.use(cors());
// app.use(morgan("combined"));
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = parseInt(process.argv[2]) || process.env.PORT || 3000;

app.set("port", port);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Views in public directory
app.use(express.static("public"));
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use("*", (req, res, next) => {
  res.fail = failCase({ req, res });
  res.success = SuccessCase({ req, res });
  next();
});

//routes will be here
app.use("/api",ApiRouter)

//handle other requests with 404 if not handled previously
app.use("*", (req, res, next) => {
  return res.status(404).json({
    success: false,
    message: "Endpoint does not exist!",
  });
});

//server listening, named server as it can be further used. Eg, in peparing socket connection
const server = app.listen(port, () => {
  console.log(
    `Server is listening : ${Date()}`,
    `, PORT ==`,
    port
  );
});
