import { success, fail } from "./../../services/response/";
import Subscriber from "./model";
import { getAnyVendor } from "../vendor/init";

export async function initSubscriber(req, res) {

  let vendor;
  try {
    vendor = await getAnyVendor();
  } catch (err) {
    console.log(err);
  }

  if (!(vendor)) vendor = { _id: "5b54e618ae6b2a035fe83843" };

  const subscriber = {
    email: "research@bezop.io",
    frequency: "weekly",
    interest: ["deals"],
    vendors: [vendor],
  };

  const record = new Subscriber(subscriber);
  return record.save()
    .then((result) => {
      if (!result) {
        fail(res, 404, "Error not found newly added Subscriber");
      }
      console.log(`\r\nSubscriber is added ${result.id}`);
      return success(res, 200, result, "Done Initializing Subscriber Data!");
    }).catch((err) => {
      fail(res, 500, `Error adding Subscriber ${err.message}`);
    });
}

export function getAnySubscriber() {
  Subscriber.findOne().sort({ created_at: -1 }).exec((_err, result) => result);
}
