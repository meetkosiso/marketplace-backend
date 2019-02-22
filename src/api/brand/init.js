import { success, fail } from "./../../services/response/";
import Brand from "./model";
import { getAnyAdmin } from "../admin/init";
import { getAnyVendor } from "../vendor/init";

export async function initBrand(req, res) {
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

  if (!(vendor)) vendor = { _id: "5b83c483f85b7a561ce95107" };

  let brand1 = {
    _id: ("5b83d591f85b7a561ce9510c"),
    viewCount: 1,
    standing: "active",
    action: "allow",
    vendor: vendor._id,
    name: "Trios Air",
    description: "Trios Air Trios Air Trios Air Trios Air",
    updated: Date("2018-08-27T10:42:25.185Z"),
    createdAt: Date("2018-08-27T10:42:25.185Z"),
    updatedAt: Date("2018-08-27T10:44:10.007Z"),
    __v: 0,
    icon: "https://storage.googleapis.com/olaife/images/media/5b83d591f85b7a561ce9510ce9dac16259764705e5f0e87c3bd016e6.jpeg"
  };
  
  const brand2 = {
    _id: ("5b83d638f85b7a561ce9510d"),
    viewCount: 1,
    standing: "active",
    action: "allow",
    vendor: vendor._id,
    name: "Red Dot",
    description: "Red Dot Red Dot Red",
    updated: Date("2018-08-27T10:45:12.212Z"),
    createdAt: Date("2018-08-27T10:45:12.213Z"),
    updatedAt: Date("2018-08-27T10:45:22.865Z"),
    __v: 0,
    icon: "https://storage.googleapis.com/olaife/images/media/5b83d638f85b7a561ce9510df5109bb548e32caa0c02efa1c7d5ac22.jpeg"
  }

  const b1 = new Brand(brand1);
  b1.save().then(result => console.log(result));
  const b2 = new Brand(brand2);

  return b2.save()
    .then((result) => {
      if (!result) {
        fail(res, 404, "Error not found newly added Brand");
      }
      console.log(`\r\nBrand is added ${result.id}`);
      return success(res, 200, result, "Done Initializing Brand Data!");
    }).catch((err) => {
      fail(res, 500, `Error adding Brand ${err.message}`);
    });
}

export function getAnyBrand() {
  Brand.findOne().sort({ created_at: -1 }).exec((_err, result) => result);
}
