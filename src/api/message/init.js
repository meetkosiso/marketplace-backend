import { success, fail } from "./../../services/response/";
import Message from "./model";
import { getAnyAdmin } from "../admin/init";
import { getAnyVendor } from "../vendor/init";
import { getAnyCustomer } from "../customer/init";

export async function initMessage(req, res) {

  let admin;
  try {
    admin = await getAnyAdmin();
  } catch (err) {
    console.log(err);
  }
  if (!(admin)) admin = { _id: "5b83c483f85b7a561ce95107" };

  let vendor;
  try {
    vendor = await getAnyVendor();
  } catch (err) {
    console.log(err);
  }
  if (!(vendor)) vendor = { _id: "5b83c483f85b7a561ce95107" };

  let customer;
  try {
    customer = await getAnyCustomer();
  } catch (err) {
    console.log(err);
  }
  if (!(customer)) customer = { _id: "5b83c483f85b7a561ce95107" };

  const message = {
    admin: admin._id,
    vendor: vendor._id,
    customer: customer._id,
    visitorName: "",
    visitorEmail: "",
    sentBy: "visitor",
    kind: "chat",
    messageSession: "0987654321",
    messageBetween: "customer_vendor",
    subject: "Best deals",
    message: "Message on sales within a defined interval by vendor.",
  };

  const record = new Message(message);
  return record.save()
    .then((result) => {
      if (!result) {
        fail(res, 404, "Error not found newly added Message");
      }
      console.log(`\r\nMessage is added ${result.id}`);
      return success(res, 200, result, "Done Initializing Message Data!");
    }).catch((err) => {
      fail(res, 500, `Error adding Message ${err.message}`);
    });
}

export function getAnyMessage() {
  Message.findOne().sort({ created_at: -1 }).exec((_err, result) => result);
}
