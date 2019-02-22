import { success, fail } from "./../../services/response/";
import Coupon from "./model";
import { getAnyVendor } from "../vendor/init";

export async function initCoupon(req, res) {
  let vendor;
  try {
    vendor = await getAnyVendor();
  } catch (err) {
    console.log(err);
  }

  if (!(vendor)) vendor = { _id: "5b83c483f85b7a561ce95107" };


  const coupon = new Coupon({
    vendor: vendor._id,
    title: "Christmas Bonanza",
    code: "XMAS-COOL",
    amount: 1450,
    till: Date("2019-08-27T10:28:10.419Z"),
  });

  return coupon.save()
    .then((result) => {
      if (!result) {
        fail(res, 404, "Error not found newly added Coupon");
      }
      console.log(`\r\nCoupon is added ${result.id}`);
      return success(res, 200, result, "Done Initializing Coupon Data!");
    }).catch((err) => {
      fail(res, 500, `Error adding Coupon ${err.message}`);
    });
}

export function getAnyCoupon() {
  Coupon.findOne().sort({ created_at: -1 }).exec((_err, result) => result);
}
