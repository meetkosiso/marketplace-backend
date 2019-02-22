import { success, fail } from "./../../services/response/";
import Ticket from "./model";
import { randomNonce } from "./../../services/helpers";
import { getAnyAdmin } from "../admin/init";
import { getAnyVendor } from "../vendor/init";
import { getAnyCustomer } from "../customer/init";
import { getAnyOrder } from "../order/init";

export async function initTicket(req, res) {
  let admin;
  try {
    admin = await getAnyAdmin();
  } catch (err) {
    console.log(err);
  }

  if (!(admin)) admin = { _id: "5b54e618ae6b2a035fe83843" };

  let vendor;
  try {
    vendor = await getAnyVendor();
  } catch (err) {
    console.log(err);
  }

  if (!(vendor)) vendor = { _id: "5b54e618ae6b2a035fe83843" };

  let customer;
  try {
    customer = await getAnyCustomer();
  } catch (err) {
    console.log(err);
  }

  if (!(customer)) customer = { _id: "5b54e618ae6b2a035fe83843" };

  let order;
  try {
    order = await getAnyOrder();
  } catch (err) {
    console.log(err);
  }

  if (!(order)) order = { _id: "5b54e618ae6b2a035fe83843" };

  const ticket = {
    admin: admin._id,
    kind: "arbitration",
    userType: "customer",
    vendor: vendor._id,
    customer: customer._id,
    arbitrator: admin._id,
    amountDisputed: 145.7400,
    orderDisputed: order._id,
    complaint: "My order was not delivered on time and it arrived in bad condition.",
    subject: "Damage Goods",
    subjectId: "order",
    resolution: "Refund Customer",
    assignedDate: "2018-09-03T10:07:59.883Z",
    resolvedDate: "2018-09-03T10:09:59.883Z",
  };

  const record = new Ticket(ticket);
  return record.save()
    .then((result) => {
      if (!result) {
        fail(res, 404, "Error not found newly added Ticket");
      }
      console.log(`\r\nTicket is added ${result.id}`);
      return success(res, 200, result, "Done Initializing Ticket Data!");
    }).catch((err) => {
      fail(res, 500, `Error adding Ticket ${err.message}`);
    });
}

export function getAnyTicket() {
  Ticket.findOne().sort({ created_at: -1 }).exec((_err, result) => result);
}
