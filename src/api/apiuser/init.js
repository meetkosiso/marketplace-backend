import { success, fail } from "./../../services/response/";
import Apiuser from "./model";
import { randomNonce } from "./../../services/helpers";

export function initApiuser(req, res) {

  const apiuser = {
    username: "bezop",
    lastAccess: [{
      accessDate: Date.now(),
      ipAddress: "34.200.1.90",
    }],
    fullname: "Mouse Rat",
    phone: "4570977344555",
    email: "research@bezop.io",
    password: "fgg64dfih08tvvrsxee",
    apikey: randomNonce(),
    apicalls: {
      amount: 10000,
      rate: 125,
    },
  };

  const record = new Apiuser(apiuser);
  return record.save()
    .then((result) => {
      if (!result) {
        fail(res, 404, "Error not found newly added Apiuser");
      }
      console.log(`\r\nApiuser is added ${record.id}`);
      return success(res, 200, result, "Done Initializing Apiuser Data!");
    }).catch((err) => {
      fail(res, 500, `Error adding Apiuser ${err.message}`);
    });
}

export function getAnyApiuser() {
  Apiuser.findOne().sort({ created_at: -1 }).exec((_err, result) => result);
}
