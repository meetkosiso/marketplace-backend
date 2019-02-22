
import Currency, { ObjectId } from "./model";
import { success, fail, notFound } from "./../../services/response";
import { dollarConverter } from "../../services/helpers";


/**
 * @description Find a single Currency Object with a given code
 * @param code Currency code
 */
export function findCurrencyByCode(code) {
  return Currency
    .findOne({ code })
    .then((result) => {
      if (!result) return {};
      return result;
    })
    .catch((err) => { throw err; });
}

// Create and Save a new record
export function create(req, res) {
  const data = req.body || {};
  const { userId, userType } = res.locals;
  let adminId;

  if (userType === "admin") {
    adminId = userId;
  } else {
    return fail(res, 422, `Only Admins are allowed to update this record not ${userType}`);
  }

  // Validate request
  if (!data.name) return fail(res, 422, "name cannot be empty and must be alphanumeric.");
  if (!data.code) return fail(res, 422, "code cannot be empty and must be alphanumeric.");
  if (!data.description) return fail(res, 422, "description cannot be empty and must be alphanumeric.");
  if (!data.kind) return fail(res, 422, "Currency type cannot be empty and must be fiat or digital.");
  if (!data.symbol) return fail(res, 422, "symbol cannot be empty and must be alphanumeric.");
  if (!data.exchange) return fail(res, 422, "exchange cannot be empty and must be a Numeric.");

  const newObject = {};
  newObject.admin = adminId;
  if (data.name) newObject.name = data.name;
  if (data.code) newObject.code = data.code;
  if (data.description) newObject.description = data.description;
  if (data.kind) newObject.kind = data.kind;
  if (data.symbol) newObject.symbol = data.symbol;
  if (data.currencyAddress) newObject.currencyAddress = data.currencyAddress;
  if (data.exchange) newObject.exchange = data.exchange;

  // Create a record
  const record = new Currency(newObject);

  // Save Product in the database
  return record.save()
    .then((result) => {
      if (!result) return notFound(res, "Error: newly submitted record not found");
      return success(res, 200, result, "New record has been created successfully!");
    })
    .catch(err => fail(res, 500, `Error creating record.\r\n${err.message}`));
}


// Retrieve and return all records from the database.
export function findAll(req, res) {
  return Currency.find()
    .then(result => success(res, 200, result, "retrieving record(s) was successfully!"))
    .catch(err => fail(res, 500, `Error retrieving record(s).\r\n${err.message}`));
}

// Retrieve a single record with a given recordId
export function findOne(req, res) {
  const recordId = req.params.currencyId || "";
  if (!recordId) return fail(res, 400, "No record Id as request parameter");
  if (!ObjectId.isValid(recordId)) return fail(res, 422, "Invalid record Id as request parameter");
  return Currency.findById(recordId)
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
 * @description findActive controller returns all active currencies to an unauthenticated route
 * @param {*} req request object
 * @param {*} res response object
 */
export function findActive(req, res) {
  return Currency.find({ standing: "active" })
    .then(result => success(res, 200, result, "retrieving record(s) was successfully!"))
    .catch(err => fail(res, 500, `Error retrieving record(s).\r\n${err.message}`));
}

// Retrieve a single record with a given recordId
export function findExchange(req, res) {
  const { amount, currency, conversion } = req.params;
  if (Number(amount) > 0.00000000 && typeof currency === "string") {
    // ok
  } else {
    return fail(res, 400, `Incorrect request parameter(s): ${amount}, ${currency}, ${conversion}`);
  }
  return dollarConverter(currency, amount, conversion)
    .then((result) => {
      if (!result) return notFound(res, `record not found with id ${currency}.`);
      return success(res, 200, result, `retrieving record was successfully with id ${currency}.`);
    }).catch(err => notFound(res, `error retrieving ${currency}. ${err}`));
}

// Update record identified by the Id in the request
export function update(req, res) {
  const recordId = req.params.currencyId || "";
  if (!recordId) return fail(res, 400, "No record Id as request parameter");
  if (!ObjectId.isValid(recordId)) return fail(res, 422, "Invalid record Id as request parameter");
  const data = req.body || {};
  const { userId, userType, userRole } = res.locals;
  let adminId;

  if (userType === "admin" && ["super", "master", "finance"].includes(userRole)) {
    adminId = userId;
  } else {
    return fail(res, 422, `Only Admins are allowed to update this record not ${userType}`);
  }

  // Validate request
  if (!data.name) return fail(res, 422, "name cannot be empty and must be alphanumeric.");
  if (!data.code) return fail(res, 422, "code cannot be empty and must be alphanumeric.");
  if (!data.description) return fail(res, 422, "description cannot be empty and must be alphanumeric.");
  if (!data.kind) return fail(res, 422, "Currency type cannot be empty and must be fiat or digital.");
  if (!data.symbol) return fail(res, 422, "symbol cannot be empty and must be alphanumeric.");
  if (!data.exchange) return fail(res, 422, "exchange cannot be empty and must be a Numeric.");

  const newObject = {};
  newObject.admin = adminId;
  if (data.name) newObject.name = data.name;
  if (data.code) newObject.code = data.code;
  if (data.description) newObject.description = data.description;
  if (data.kind) newObject.kind = data.kind;
  if (data.symbol) newObject.symbol = data.symbol;
  if (data.currencyAddress) newObject.currencyAddress = data.currencyAddress;
  if (data.exchange) newObject.exchange = data.exchange;
  if (data.standing && ["active", "inactive", "trashed"].includes(data.standing)) {
    newObject.standing = data.standing;
  }

  // Find record and update it with id
  return Currency.findByIdAndUpdate(recordId, { ...newObject }, { new: true })
    .then((result) => {
      if (!result) return notFound(res, `Error: newly submitted record not found with id ${recordId}`);
      return success(res, 200, result, "New record has been created successfully!");
    })
    .catch(err => fail(res, 500, `Error updating record with id ${recordId}.\r\n${err.message}`));
}

// Delete a currency with the specified currencyId in the request
export async function destroy(req, res) {
  const recordId = req.params.currencyId || "";
  // Validate request
  if (!recordId) return fail(res, 400, "Invalid record Id as request parameter");
  return Currency.findByIdAndRemove(recordId)
    .then((record) => {
      if (!record) return notFound(res, `Record not found with id ${recordId}`);
      return success(res, 200, [], "Record deleted successfully!");
    })
    .catch((err) => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return notFound(res, `Error: record not found with id ${recordId}\r\n${err.message}`);
      }
      return fail(res, 500, `Error: could not delete record with id ${recordId}\r\n${err.message}`);
    });
}
