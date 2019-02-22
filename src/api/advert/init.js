import { success, fail } from "./../../services/response/";
import Advert from "./model";
import { randomNonce } from "./../../services/helpers";
import { getAnyAdmin } from "../admin/init";
import { getAnyVendor } from "../vendor/init";

export async function initAdvert(req, res) {
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

  const advert = {
    admin: admin._id,
    vendor: vendor._id,
    title: "Live Fish & Snail",
    content: "Cat Fish from the sea",
    tag: "cat, fish, nancy, sea",
    meta: {
      views: randomNonce(),
      clicks: randomNonce(),
    },
  };

  const record = new Advert(advert);
  return record.save()
    .then((result) => {
      if (!result) {
        fail(res, 404, "Error not found newly added Advert");
      }
      console.log(`\r\nAdvert is added ${record.id}`);
      return success(res, 200, result, "Done Initializing Advert Data!");
    }).catch((err) => {
      fail(res, 500, `Error adding Advert ${err.message}`);
    });
}

export function getAnyAdvert() {
  Advert.findOne().sort({ created_at: -1 }).exec((_err, result) => result);
}
