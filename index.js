const config = require("config");
const app = require("./server");

app.listen(config.get("port"));
