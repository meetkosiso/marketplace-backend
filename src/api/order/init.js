import { success, fail } from "./../../services/response/";
import Order from "./model";
import { randomNonce } from "./../../services/helpers";
import { getAnyCurrency } from "../currency/init";
import { getAnyVendor } from "../vendor/init";
import { getAnyCustomer } from "../customer/init";
import { getAnyProduct } from "../product/init";

export async function initOrder(req, res) {
  const currency = await getAnyCurrency() || "5b54e618ae6b2a035fe83843";
  const vendor = await getAnyVendor() || "5b54e618ae6b2a035fe83843";
  const customer = await getAnyCustomer() || "5b54e618ae6b2a035fe83843";
  const product = await getAnyProduct() || "5b54e618ae6b2a035fe83843";

  const order = {
    orderNum: randomNonce(),
    vendor: vendor._id,
    customer: customer._id,
    coupon: "5b54e618ae6b2a035fe83843",
    products: [{
      product: product._id,
      quantity: 7,
      sku: "77YHYR6",
      name: "Arduino Micro",
      unitCost: 90.09755,
      vat: 80.0890,
    },
    {
      product: "5ba4e618ae6b2a035fe83843",
      quantity: 7,
      sku: "77YHYR6",
      name: "Arduino Micro",
      unitCost: 90.09755,
      vat: 980.0890,
    }],
    payable: {
      amount: 4500,
      currency: currency._id,
    },
    paymentDetails: {
      amount: "89.00976790",
      currency: "5b54e618ae6b2a035fe83843",
      txHash: "0xa11e9aa7aff1bd6cb6c7d886cc531e75a8bcdea1ddcf387937aae3f3a0addb20",
    },
    shipmentDetails: {
      recipient: "ADAMU Mikel",
      country: "Nigeria",
      state: "Enugu",
      city: "Nsukka",
      street: "University Road",
      building: "310",
      zip: "69340",
      phone: "090224222425",
      email: "adam@gmail.co",
      deliveryNote: "Drop it at the gate",
    },
    trackingDetails: {
      company: "Nano Intelligence TRACKING SYSTEMS LTD.",
      code: "NANO4640347",
      standing: "pending",
    },
    transaction: {
      currencyAddress: "23748373shsyddhd78383",
      nonce: "23748373",
      txHash: "23748373",
      blockNumber: "23748373",
      timeStamp: "23748373shsyddhd78383",
      from: "23748373shsyddhd78383",
      to: "23748373shsyddhd78383",
      value: "23748373shsyddhd78383",
      contractAddress: "23748373shsyddhd78383",
      input: "23748373shsyddhd78383",
      type: "23748373shsyddhd78383",
      gas: "23748373shsyddhd78383",
      gasUsed: "23748373shsyddhd78383",
      isError: "23748373shsyddhd78383",
      errCode: "23748373shsyddhd78383",
    },
  };

  const record = new Order(order);
  return record.save()
    .then((result) => {
      if (!result) {
        fail(res, 404, "Error not found newly added Order");
      }
      console.log(`\r\nOrder is added ${record.id}`);
      return success(res, 200, result, "Done Initializing Order Data!");
    }).catch((err) => {
      fail(res, 500, `Error adding Order ${err.message}`);
    });
}

export function getAnyOrder() {
  Order.findOne().sort({ created_at: -1 }).exec((_err, result) => result);
}
