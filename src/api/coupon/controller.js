
import Coupon, { ObjectId } from "./model";
import { success, fail, notFound } from "./../../services/response";


// Retrieve and return all records from the database.
export function findAll(req, res) {
  return Coupon.find()
    .populate({ path: "vendor", select: "id url businessName domainName", match: { standing: "active" } })
    .then(result => success(res, 200, result, "retrieving record(s) was successfully!"))
    .catch(err => fail(res, 500, `Error retrieving record(s).\r\n${err.message}`));
}

// Retrieve a single record with a given recordId
export function findOne(req, res) {
  const recordId = req.params.couponId || "";
  if (!recordId) return fail(res, 400, "No record Id as request parameter");
  if (!ObjectId.isValid(recordId)) return fail(res, 422, "Invalid record Id as request parameter");
  return Coupon.findById(recordId)
    .populate({ path: "vendor", select: "id url businessName domainName", match: { standing: "active" } })
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


// Create and Save a new record
export function create(req, res) {
  const data = req.body || {};
  const { userId, userType } = res.locals;
  let vendorId;

  if (userType === "vendor") {
    vendorId = userId;
  } else {
    return fail(res, 422, `Only vendors are allowed to update this record not ${userType}`);
  }
  // Validate request
  if (!data.title) return fail(res, 422, "title cannot be empty and must be alphanumeric.");
  if (!data.code) return fail(res, 422, "code cannot be empty and must be alphanumeric.");
  if (!data.amount) return fail(res, 422, "amount cannot be empty and must be numeric.");
  if (!data.till) return fail(res, 422, "Expiry date cannot be empty and must be in 'YYYY-MM-DD'.");

  const newObject = {};

  newObject.vendor = vendorId;
  if (data.title) newObject.title = data.title;
  if (data.code) newObject.code = data.code;
  if (data.amount) newObject.amount = data.amount;
  if (data.till) newObject.till = data.till;

  // Create a record
  const record = new Coupon(newObject);

  // Save Product in the database
  return record.save()
    .then((result) => {
      if (!result) return notFound(res, "Error: newly submitted record not found");
      return success(res, 200, result, "New record has been created successfully!");
    })
    .catch(err => fail(res, 500, `Error creating record.\r\n${err.message}`));
}


// Update record identified by the Id in the request
export function update(req, res) {
  const recordId = req.params.couponId || "";
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
  if (!data.title) return fail(res, 422, "title cannot be empty and must be alphanumeric.");
  if (!data.code) return fail(res, 422, "code cannot be empty and must be alphanumeric.");
  if (!data.amount) return fail(res, 422, "amount cannot be empty and must be numeric.");
  if (!data.till) return fail(res, 422, "Expiry date cannot be empty and must be in 'YYYY-MM-DD'.");

  const newObject = {};
  newObject.vendor = vendorId;
  if (data.title) newObject.title = data.title;
  if (data.code) newObject.code = data.code;
  if (data.amount) newObject.amount = data.amount;
  if (data.till) newObject.till = data.till;

  // Find record and update it with id
  return Coupon.findByIdAndUpdate(recordId, { ...newObject }, { new: true })
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
  let vendorId;

  if (userType === "vendor") {
    vendorId = userId;
  } else {
    return fail(res, 422, `Only vendors are allowed to update this record not ${userType}`);
  }
  // Validate request
  if (!data.title) return fail(res, 422, "title cannot be empty and must be alphanumeric.");
  if (!data.code) return fail(res, 422, "code cannot be empty and must be alphanumeric.");
  if (!data.amount) return fail(res, 422, "amount cannot be empty and must be numeric.");
  if (!data.till) return fail(res, 422, "Expiry date cannot be empty and must be in 'YYYY-MM-DD'.");

  const newObject = {};
  newObject.vendor = vendorId;
  if (data.title) newObject.title = data.title;
  if (data.code) newObject.code = data.code;
  if (data.amount) newObject.amount = data.amount;
  if (data.till) newObject.till = data.till;

  // Find record and update it with id
  return Coupon.findByIdAndUpdate(recordId, { ...newObject }, { new: true })
    .then((result) => {
      if (!result) return notFound(res, `Error: newly submitted record not found with id ${recordId}`);
      return success(res, 200, result, "New record has been created successfully!");
    })
    .catch(err => fail(res, 500, `Error updating record with id ${recordId}.\r\n${err.message}`));
}


// Delete a coupon with the specified couponId in the request
export async function destroy(req, res) {
  const recordId = req.params.couponId || "";
  if (!recordId) return fail(res, 400, "No record Id as request parameter");
  if (!ObjectId.isValid(recordId)) return fail(res, 422, "Invalid record Id as request parameter");
  return Coupon.findByIdAndRemove(recordId)
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
