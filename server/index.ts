import * as nconf from "./config";
import {app} from "./server";

console.log(`Listening on ${nconf.get("PORT")}`);
app.listen(nconf.get("PORT"));
