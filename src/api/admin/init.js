import { success, fail } from "./../../services/response/";
import Admin from "./model";
import { randomNonce } from "./../../services/helpers";


const admin = new Admin({
  nonce: randomNonce(),
  publicAddress: "0x041d105359a5a681aaa8d14bca9919ad6e362f8a",
  username: "Adam",
  role: "super",
  lastAccess: [{
    accessDate: "2018-08-20",
    ipAddress: "192.160.0.187",
  }],
  fullname: "Adam Abel",
  phone: "00128065544",
  address: "Lekki Phase II",
  email: "admin@bezop.com", 
  password: "pass",
  notifications: [{
    date: "2018-07-12T11:17:29.845Z",
    notice: "New user signup",
    standing: "unread",
  }],
  completeProfile: true,
  onlineStatus: false,
  standing: "active",
});

export function initAdmin(req, res) {
  admin.save()
    .then((result) => {
      if (!result) {
        fail(res, 404, "Error not found newly added admin");
      }
      console.log(`\r\nAdmin is added ${admin}`);
      return success(res, 200, result, "Done Initializing Admin Data!");
    }).catch((err) => {
      fail(res, 500, `Error adding admin ${err.message}`);
    });
}

export function getAnyAdmin() {
  Admin.findOne().sort({ created_at: -1 }).exec((_err, result) => result);
}
