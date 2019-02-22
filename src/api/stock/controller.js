
import Stock, { ObjectId } from "./model";
import { success, fail, notFound } from "./../../services/response";
import { stockProduct } from "../product/controller";

/**
 * @description findStockById get stock record given an Id
 * @param {String} stockId the stock id
 * @returns {Promise} stock record
 */
export function findStockById(stockId) {
  return Stock
    .findById(stockId)
    .populate({ path: "product", match: { standing: "active" } })
    .then((result) => {
      if (!result) return {};
      return result;
    })
    .catch((err) => { throw err; });
}

/**
 * @description findOneStockByProduct get stock record given product Id
 * @param {String} product id in the stock
 * @param {Number} available of the stock. Check that the available is greater than 0
 * @returns {Promise} most recent stock record of given product
 */
export function findOneStockByProduct(product) {
  return Stock
    .findOne({ product })
    .limit(1)
    .sort({ createdAt: "desc" })
    .populate({ path: "product" })
    .then((result) => {
      if (!result) return {};
      return result;
    })
    .catch((err) => { throw err; });
}

/**
 * @description findAll get all stock records
 * @param {Object} req the http request object
 * @param {Object} res the http response object
 * @returns {Promise} stock records object array
 */
export function findAll(req, res) {
  return Stock.find()
    .populate({ path: "product" })
    .then(result => success(res, 200, result, "retrieving record(s) was successfully!"))
    .catch(err => fail(res, 500, `Error retrieving record(s).\r\n${err.message}`));
}

/**
 * @description findAll get all stock records
 * @param {Object} req the http request object
 * @param {Object} res the http response object
 * @returns {Promise} stock records object array
 */
export function findVendorStocks(req, res) {
  const { userId, userType } = res.locals;
  let vendorId;

  if (userType === "vendor") {
    vendorId = userId;
  } else {
    return fail(res, 422, `Only vendors are allowed to update this record not ${userType}`);
  }
  return Stock.find({ vendor: vendorId })
    .populate({ path: "product" })
    .then(result => success(res, 200, result, "retrieving record(s) was successfully!"))
    .catch(err => fail(res, 500, `Error retrieving record(s).\r\n${err.message}`));
}

/**
 * @description findOne get all stock records
 * @param {Object} req the http request object
 * @param {Object} res the http response object
 * @requires {String} stockId as req parameter
 * @returns {Promise} stock records object array
 */
export function findOne(req, res) {
  const recordId = req.params.stockId || "";
  if (!recordId) return fail(res, 400, "No record Id as request parameter");
  if (!ObjectId.isValid(recordId)) return fail(res, 422, "Invalid record Id as request parameter");
  return Stock.findById(recordId)
    .populate({ path: "product" })
    .then((result) => {
      if (!result) return notFound(res, `Error: record not found with id ${recordId}.`);
      return success(res, 200, result, `retrieving record was successfully with id ${recordId}.`);
    }).catch((err) => {
      if (err.kind === "ObjectId") {
        notFound(res, `Error retrieving record with id ${recordId}.\r\n${err.message}`);
      }
      return fail(res, 500, `Error retrieving record with id ${recordId}.\r\n${err.message}`);
    });
}


/**
 * @description create saves stock record
 * @param {Object} req the http request object
 * @param {Object} res the http response object
 * @requires {Object} stock record as req parameter
 * @returns {Promise} stock record object
 */
export async function create(req, res) {
  const data = req.body || {};
  const { userId, userType } = res.locals;
  let vendorId;

  if (userType === "vendor") {
    vendorId = userId;
  } else {
    return fail(res, 422, `Only vendors are allowed to update this record not ${userType}`);
  }

  // Validate request
  // if (!data.vendor) return fail(res, 422, "vendor id cannot be empty.");
  // if (!ObjectId.isValid(data.vendor)) return fail(res, 422, "Invalid vendor Id");
  if (!data.product) return fail(res, 422, "stock product cannot be empty.");
  if (!data.orderNum) return fail(res, 422, "stock orderNum cannot be empty");
  if (!(data.kind === "addition" || data.kind === "subtraction")) {
    return fail(res, 422, "kind of stock operation must be either of 'addition', or 'subtraction'");
  }
  // if (!data.page) return fail(res, 422, "slide page cannot be empty");
  // if (!(["text", "image"].indexOf(data.page) >= 0)) {
  //   return fail(res, 422, "slide page must be either of product, brand, category or blog.");
  // }
  if (!data.quantity) return fail(res, 422, "stock quantity cannot be empty");
  // If kind is "addition" then unitCost and unitPrice is compulsory
  if (data.kind === "addition") {
    if (!data.unitCost) return fail(res, 422, "stock unitCost must be of type Array");
    if (!data.unitPrice) return fail(res, 422, "stock unitPrice cannot be empty");
  }
  if (!data.description) return fail(res, 422, "stock description cannot be empty");

  const newObject = {};
  newObject.vendor = vendorId;
  newObject.kind = data.kind;
  if (data.product) newObject.product = data.product;
  if (data.orderNum) newObject.orderNum = data.orderNum;
  if (data.quantity) newObject.quantity = data.quantity;
  if (data.unitCost) newObject.unitCost = data.unitCost;
  if (data.unitPrice) newObject.unitPrice = data.unitPrice;
  if (data.description) newObject.description = data.description;

  // Create a record
  const record = new Stock(newObject);

  // Save Stock in the database
  return record.save()
    .then((result) => {
      if (!result) return notFound(res, "Error: newly submitted record not found");
      console.log(data.kind, data.quantity, result.product);
      // If the kind is subtraction assign null to unitPrice
      const unitPrice = data.unitPrice || null;
      // Updating the quantity available in Product
      return stockProduct(data.kind, data.quantity, data.product, unitPrice)
        .then((stocking) => {
          if (!stocking) return notFound(res, "Error: stocking record not found");
          return success(res, 200, stocking, "Stocking product was successful!");
        })
        .catch(err => fail(res, 500, `Error stocking product.\r\n${err.message}`));
    })
    .catch(err => fail(res, 500, `Error creating record.\r\n${err.message}`));
}


/**
 * @description modify patch stock record identified by the Id in the request
 * @param {Object} req the http request object
 * @param {Object} res the http response object
 * @requires {Object} stock record as req parameter
 * @returns {Promise} stock record object
 */
export function modify(req, res) {
  const recordId = req.params.stockId || "";
  if (!recordId) return fail(res, 400, "No record Id as request parameter");
  if (!ObjectId.isValid(recordId)) return fail(res, 422, "Invalid record Id as request parameter");
  const data = req.body || {};
  const { userId, userType } = res.locals;
  let vendorId;

  if (userType === "vendor") {
    vendorId = userId;
  } else {
    return fail(res, 422, `Only vendors are allowed to update this record not ${userType}`);
  }

  // Validate request
  if (!data.vendor) return fail(res, 422, "vendor id cannot be empty.");
  if (!ObjectId.isValid(data.vendor)) return fail(res, 422, "Invalid vendor Id");
  if (!data.product) return fail(res, 422, "stock product cannot be empty.");
  if (!data.orderNum) return fail(res, 422, "stock orderNum cannot be empty");
  if (!(["addition", "subtraction"].indexOf(data.kind) >= 0)) {
    return fail(res, 422, "kind of stock operation must be either of add, or destroy");
  }
  if (!data.page) return fail(res, 422, "slide page cannot be empty");
  if (!(["text", "image"].indexOf(data.page) >= 0)) {
    return fail(res, 422, "slide page must be either of product, brand, category or blog.");
  }
  if (!data.quantity) return fail(res, 422, "stock quantity cannot be empty");
  if (!data.unitCost) return fail(res, 422, "stock unitCost must be of type Array");
  if (!data.unitPrice) return fail(res, 422, "stock unitPrice cannot be empty");
  if (!data.description) return fail(res, 422, "stock description cannot be empty");

  const newObject = {};
  newObject.vendor = vendorId;
  if (data.product) newObject.product = data.product;
  if (data.orderNum) newObject.orderNum = data.orderNum;
  if (data.quantity) newObject.quantity = data.quantity;
  if (data.unitCost) newObject.unitCost = data.unitCost;
  if (data.unitPrice) newObject.unitPrice = data.unitPrice;
  if (data.description) newObject.description = data.description;

  // Find record and update it with id
  return Stock.findByIdAndUpdate(recordId, newObject, { new: true })
    .populate({ path: "product" })
    .then((result) => {
      if (!result) return notFound(res, `Error: newly submitted record not found with id ${recordId}`);
      return success(res, 200, result, "New record has been created successfully!");
    })
    .catch(err => fail(res, 500, `Error updating record with id ${recordId}.\r\n${err.message}`));
}
