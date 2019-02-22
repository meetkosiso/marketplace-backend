
import Order, { ObjectId } from "./model";
import { success, fail, notFound } from "./../../services/response";
import { stockProduct, findProductById } from "../product/controller";
import { propertyExist } from "../../services/helpers";


/**
 * @description findOneOrderProduct finds the first occurance of a product in the
 * the order collection. The function is used in delete operation to ensure
 * no product in transaction is ever deleted.
 * @param {String} productId is the product id to query the collection
 */
export function findOneOrderProduct(productId) {
  if (!ObjectId.isValid(productId)) throw new Error("Invalid product Id as parameter");
  return Order.findOne({ "products.product": productId })
    .then(result => result)
    .catch((err) => {
      throw new Error(`Error retrieving record with id ${productId}.\r\n${err.message}`);
    });
}

// Create and Save a new record
export async function create(req, res) {
  const data = req.body || {};
  const { userId, userType } = res.locals;
  let customerId;

  if (userType === "customer") {
    customerId = userId;
  } else {
    return fail(res, 422, `Only customers are allowed to update this record not ${userType}`);
  }

  // Validate request
  if (!data.vendor) return fail(res, 400, "No record Id as request parameter");
  if (!ObjectId.isValid(data.vendor)) return fail(res, 422, "Invalid record Id as request parameter");
  if (!data.orderNum) return fail(res, 422, "title cannot be empty but either digital, physical.");
  // if (!data.customer)return fail(res, 422, "customer cannot be empty and must be alphanumeric.");
  if (!data.products) return fail(res, 422, "order status cannot be empty and must be in pending, paid, delivered, closed");
  if (!data.shipmentDetails) return fail(res, 422, "shipment details cannot be empty and must array.");
  if (!data.payable) return fail(res, 422, "Payable amount($) and currency cannot be empty.");

  const newObject = {};
  newObject.customer = customerId;
  newObject.vendor = data.vendor;
  if (data.coupon) newObject.coupon = data.coupon;
  if (data.orderNum) newObject.orderNum = data.orderNum;

  if (data.products && typeof data.products === "object") {
    const products = [];
    console.log(data.products);
    (data.products).forEach((item, index, array) => {
      if (typeof item === "object" && item.product && item.quantity) {
        products.push({
          product: data.products[index].product,
          quantity: data.products[index].quantity,
        });
      }
    });
    newObject.products = {};
    newObject.products = products;
  }

  // Shipment details
  newObject.shipmentDetails = {};
  if (data.shipmentDetails.recipient) {
    newObject.shipmentDetails.recipient = data.shipmentDetails.recipient;
  }
  if (data.shipmentDetails.country) {
    newObject.shipmentDetails.country = data.shipmentDetails.country;
  }
  if (data.shipmentDetails.state) {
    newObject.shipmentDetails.state = data.shipmentDetails.state;
  }
  if (data.shipmentDetails.city) {
    newObject.shipmentDetails.city = data.shipmentDetails.city;
  }
  if (data.shipmentDetails.street) {
    newObject.shipmentDetails.street = data.shipmentDetails.street;
  }
  if (data.shipmentDetails.building) {
    newObject.shipmentDetails.building = data.shipmentDetails.building;
  }
  if (data.shipmentDetails.zip) {
    newObject.shipmentDetails.zip = data.shipmentDetails.zip;
  }
  if (data.shipmentDetails.phone) {
    newObject.shipmentDetails.phone = data.shipmentDetails.phone;
  }
  if (data.shipmentDetails.email) {
    newObject.shipmentDetails.email = data.shipmentDetails.email;
  }
  if (data.shipmentDetails.deliveryNote) {
    newObject.shipmentDetails.deliveryNote = data.shipmentDetails.deliveryNote;
  }

  // Payable details
  // Amount === (unitCost * quantity)
  newObject.payable = {};
  if (data.payable.amount) {
    newObject.payable.amount = data.payable.amount;
  }

  if (data.payable.currency) {
    newObject.payable.currency = data.payable.currency; // must be in USD
  }

  // Create a record
  const record = new Order(newObject);

  // Updating stock (quantity of Product in product collection)
  const arrayOfObjects = data.products; // array of objects {}
  try {
    const stocking = await Promise.all(arrayOfObjects.map((item, index) => stockProduct("subtraction", item.quantity, item.product)));
    stocking.forEach((product, index) => {
      if (product && product._id) {
        console.log(`\r\n******\r\n unstocking ${product._id}`);
      }
    });
  } catch (err) {
    return fail(res, 400, `Stock ${err}`);
  }

  // Save Product in the database
  return record.save()
    .then((result) => {
      if (!result) return notFound(res, "Error: newly submitted record not found");
      return success(res, 200, result, "Saving order record(s) was successfully!");
    })
    .catch(err => fail(res, 500, `Error creating record.\r\n${err.message}`));
}


// Retrieve and return all records from the database.
export function findAll(req, res) {
  return Order.find()
    .populate({ path: "review", select: "id subjectId comment rating", match: { standing: "active" } })
    .then(result => success(res, 200, result, "retrieving record(s) was successfully!"))
    .catch(err => fail(res, 500, `Error retrieving record(s).\r\n${err.message}`));
}

// Retrieve and return all records from the database.
export function findVendorsOrder(req, res) {
  const { userId, userType, userRole } = res.locals;
  const vendorId = userId;
  return Order.find({ vendor: vendorId })
    .populate({ path: "review", select: "id subjectId comment rating", match: { standing: "active" } })
    .then(result => success(res, 200, result, "retrieving record(s) was successfully!"))
    .catch(err => fail(res, 500, `Error retrieving record(s).\r\n${err.message}`));
}

// Retrieve a single record with a given recordId
export function findOne(req, res) {
  const recordId = req.params.orderId || "";
  if (!recordId) return fail(res, 400, "No record Id as request parameter");
  if (!ObjectId.isValid(recordId)) return fail(res, 422, "Invalid record Id as request parameter");
  return Order.findById(recordId)
    .populate({ path: "review", select: "id subjectId comment rating", match: { standing: "active" } })
    .populate("products.product")
    .then((result) => {
      if (!result) return notFound(res, `Error: record not found with id ${recordId}.`);
      return success(res, 200, result, `retrieving record was successfully with id ${recordId}.`);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        notFound(res, `Error retrieving record with id ${recordId}.\r\n${err.message}`);
      }
      return fail(res, 500, `Error retrieving record with id ${recordId}.\r\n${err.message}`);
    });
}

// Update record identified by the Id in the request
export function update(req, res) {
  const recordId = req.params.orderId || "";
  if (!recordId) return fail(res, 400, "No record Id as request parameter");
  if (!ObjectId.isValid(recordId)) return fail(res, 422, "Invalid record Id as request parameter");
  const data = req.body || {};
  const { userId, userType } = res.locals;

  if (userType === "customer" || userType === "vendor") {
    // OK
  } else {
    return fail(res, 422, `Only customers and vendors are allowed to update this record not ${userType}`);
  }

  const newObject = {};
  newObject.updated = Date.now();

  const trackingDetailsObj = {};
  if (data.trackingDetails.company) {
    trackingDetailsObj.company = data.trackingDetails.company;
  }
  if (data.trackingDetails.code) {
    trackingDetailsObj.code = data.trackingDetails.code;
  }
  if (data.trackingDetails.standing) {
    trackingDetailsObj.standing = data.trackingDetails.standing;
  }
  if (data.trackingDetails.estimatedDelivery) {
    trackingDetailsObj.estimatedDelivery = data.trackingDetails.estimatedDelivery;
  }
  if (data.trackingDetails && userType === "vendor") {
    newObject.trackingDetails = Object.assign({}, trackingDetailsObj);
  }
  // Shipment details
  const shipmentDetailsObj = {};
  if (data.shipmentDetails.recipient) {
    shipmentDetailsObj.recipient = data.shipmentDetails.recipient;
  }
  if (data.shipmentDetails.country) {
    shipmentDetailsObj.country = data.shipmentDetails.country;
  }
  if (data.shipmentDetails.state) {
    shipmentDetailsObj.state = data.shipmentDetails.state;
  }
  if (data.shipmentDetails.city) {
    shipmentDetailsObj.city = data.shipmentDetails.city;
  }
  if (data.shipmentDetails.street) {
    shipmentDetailsObj.street = data.shipmentDetails.street;
  }
  if (data.shipmentDetails.building) {
    shipmentDetailsObj.building = data.shipmentDetails.building;
  }
  if (data.shipmentDetails.zip) {
    shipmentDetailsObj.zip = data.shipmentDetails.zip;
  }
  if (data.shipmentDetails.phone) {
    shipmentDetailsObj.phone = data.shipmentDetails.phone;
  }
  if (data.shipmentDetails.email) {
    shipmentDetailsObj.email = data.shipmentDetails.email;
  }
  if (data.shipmentDetails.deliveryNote) {
    shipmentDetailsObj.deliveryNote = data.shipmentDetails.deliveryNote;
  }
  if (data.shipmentDetails && userType === "vendor") {
    newObject.shipmentDetails = Object.assign({}, shipmentDetailsObj);
  }

  const transactionObj = {};
  if (data.transaction.nonce) transactionObj.nonce = data.transaction.nonce;
  if (data.transaction.txHash) transactionObj.txHash = data.transaction.txHash;
  if (data.transaction.from) transactionObj.from = data.transaction.from;
  if (data.transaction.to) transactionObj.to = data.transaction.to;
  if (data.transaction.contractAddress) {
    transactionObj.contractAddress = data.transaction.contractAddress;
  }
  if (data.transaction.currencyAddress) {
    transactionObj.currencyAddress = data.transaction.currencyAddress;
  }
  if (data.transaction.value) transactionObj.value = data.transaction.value;
  if (data.transaction.timeStamp) transactionObj.timeStamp = data.transaction.timeStamp;
  if (data.transaction.blockNumber) transactionObj.blockNumber = data.transaction.blockNumber;
  if (data.transaction.input) transactionObj.input = data.transaction.input;
  if (data.transaction.type) transactionObj.type = data.transaction.type;
  if (data.transaction.gas) transactionObj.gas = data.transaction.gas;
  if (data.transaction.gasUsed) transactionObj.gasUsed = data.transaction.gasUsed;
  if (data.transaction.isError) transactionObj.isError = data.transaction.isError;
  if (data.transaction.errCode) transactionObj.errCode = data.transaction.errCode;

  if (data.transaction && userType === "customer") {
    newObject.transaction = Object.assign({}, transactionObj);
  }

  if (data.orderStatus) newObject.orderStatus = data.orderStatus;

  // Find record and update it with id
  return Order.findByIdAndUpdate(recordId, newObject, { new: true })
    .then((result) => {
      if (!result) return notFound(res, `Error: newly submitted record not found with id ${recordId}`);
      return success(res, 200, result, "New record has been created successfully!");
    })
    .catch(err => fail(res, 500, `Error updating record with id ${recordId}.\r\n${err.message}`));
}


// Patch record identified by the Id in the request
export function modify(req, res) {
  const recordId = req.params.couponId || "";
  if (!recordId) return fail(res, 400, "No record Id as request parameter");
  if (!ObjectId.isValid(recordId)) return fail(res, 422, "Invalid record Id as request parameter");
  const data = req.body || {};
  const { userId, userType } = res.locals;
  const newObject = {};
  let adminId;

  if (userType === "admin") {
    adminId = userId;
    newObject.admin = adminId;
  } else if (userType === "customer") {
    // ok
  } else {
    return fail(res, 422, `Only Admins are allowed to update this record not ${userType}`);
  }

  newObject.updated = Date.now();

  if (data.orderStatus) newObject.orderStatus = data.orderStatus;
  if (propertyExist(data, "standing") && ["active", "inactive", "trashed"].includes(data.standing)) {
    newObject.standing = data.standing;
  }
  if (data.action && ["allow", "restrict", "deny"].includes(data.action)) {
    newObject.action = data.action;
  }
  // Find record and update it with id
  return Order.findByIdAndUpdate(recordId, newObject, { new: true })
    .then((result) => {
      if (!result) return notFound(res, `Error: newly submitted record not found with id ${recordId}`);
      return success(res, 200, result, "New record has been created successfully!");
    })
    .catch(err => fail(res, 500, `Error updating record with id ${recordId}.\r\n${err.message}`));
}

