import { success, fail } from "./../../services/response/";
import Stock from "./model";
import { randomNonce } from "./../../services/helpers";
import { getAnyAdmin } from "../admin/init";
import { getAnyVendor } from "../vendor/init";
import { getAnyCustomer } from "../customer/init";
import { getAnyOrder } from "../order/init";

export async function initStock(req, res) {
  let product;
  try {
    product = await getAnyAdmin();
  } catch (err) {
    console.log(err);
  }

  if (!(product)) product = { _id: "5b54e618ae6b2a035fe83843" };

  let vendor;
  try {
    vendor = await getAnyVendor();
  } catch (err) {
    console.log(err);
  }

  if (!(vendor)) vendor = { _id: "5b54e618ae6b2a035fe83843" };

  const stock = {
    vendor: vendor._id,
    product: product._id,
    orderNum: "0123456789",
    kind: "addition",
    quantity: 10,
    available: 10,
    unitCost: 120.35,
    unitPrice: 127,
    description: "Deals",
  };

  const record = new Stock(stock);
  return record.save()
    .then((result) => {
      if (!result) {
        fail(res, 404, "Error not found newly added Stock");
      }
      console.log(`\r\nStock is added ${result.id}`);
      return success(res, 200, result, "Done Initializing Stock Data!");
    }).catch((err) => {
      fail(res, 500, `Error adding Stock ${err.message}`);
    });
}

export function getAnyStock() {
  Stock.findOne().sort({ created_at: -1 }).exec((_err, result) => result);
}
