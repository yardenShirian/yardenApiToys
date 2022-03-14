const indexR = require("./index");
const usersR = require("./users");
const toysR = require("./toys");

// A function that will combine all the main routers
// of the application
exports.routesInit = (app) => {
  app.use("/", indexR);
  app.use("/users", usersR);
  app.use("/toys", toysR);


  app.use((req, res) => {
    res.status(404).json({ msg_error: "Url not found, 404!" });
  })
}


exports.corsAccessControl = (app) => {
  app.all('*', (req, res, next) => {
    if (!req.get('Origin')) return next();
    res.set('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, PATCH");
    res.set('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,auth-token,x-api-key');
    next();
  });
}