import { success, fail } from "./../../services/response/";
import Transaction from "./model";
import { getAnyVendor } from "../vendor/init";
import { getAnyCustomer } from "../customer/init";

export async function initTransaction(req, res) {
  let customer;
  let vendor;
  try {
    customer = await getAnyCustomer();
    vendor = await getAnyVendor();
  } catch (err) {
    console.log(err);
  }

  if (!(customer)) customer = { _id: "5b83c483f85b7a561ce95107" };
  if (!(vendor)) vendor = { _id: "5b83c483f85b7a561ce95abc" };

  const transaction0 = new Transaction({
    admin: null,
    customer: null,
    vendor: vendor._id,
    subject: "vendor",
    code: "DEPLOY_CONTRACT",
    transactionHash: "0x54838f90000yr9474",
    gas: "13700",
    value: "203000000",
    currency: "0xe1253839373f02935abcf",
    description: "Deployment of contract by vendor",
  });
  transaction0.save().then(console.log("Added transactions"));

  const transaction1 = new Transaction({
    admin: null,
    customer: customer._id,
    vendor: null,
    subject: "customer",
    code: "PRODUCT_PURCHASE",
    transactionHash: "0x54838ffurhjfyr9474",
    gas: "3750000",
    value: "37500000000",
    currency: "0xe1253839373f02935abcf",
    description: "Payment made by customer for product purchased",
  });

  return transaction1.save()
    .then((result) => {
      if (!result) {
        fail(res, 404, "Error not found newly added Transaction");
      }
      console.log(`\r\nTransaction is added ${result.id}`);
      return success(res, 200, result, "Done Initializing Transaction Data!");
    }).catch((err) => {
      fail(res, 500, `Error adding Transaction ${err.message}`);
    });
}

export function getAnyTransaction() {
  Transaction.findOne().sort({ created_at: -1 }).exec((_err, result) => result);
}
