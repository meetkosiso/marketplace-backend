import * as Access from "./model";
import { success, fail, notFound } from "./../../services/response";
import { generateId, cloneObject, isValidId, dateDaysAgo } from "../../services/helpers";
import { db } from "../../services/database";

// 1- Creates the table
export function initialize(req, res) {
  return Access.createAccess()
    .then(result => success(res, 200, result, "OK!"))
    .catch(err => fail(res, 500, `ERROR: ${err.message}`));
}

// 2- Create the table indices
export function indices(req, res) {
  return Promise.all([
    Access.createAccessByUserId(),
    Access.createAccessByUserType(),
  ])
    .then(result => success(res, 200, result, "OK!"))
    .catch(err => fail(res, 500, `ERROR: ${err.message}`));
}

// 3- Insert sample or default records
export function populate(req, res) {
  // const newArray = cloneObject(Access.vendorObject, Access.vendorSample);
  const newRecord = cloneObject(Access.accessObject, Access.sample);
  // Save Product in the database
  return db.insertData("Access", [newRecord])
    .then((result) => {
      if (!result) return notFound(res, "Error: newly submitted record not found");
      return success(res, 200, result, "New record has been created successfully!");
    })
    .catch(err => fail(res, 500, `Error creating vendor record. ${err.message}`));
}

// Retrieve and return all records from the database.
export function findAll(req, res) {
  return db.findAllData("Access")
    .then(result => success(res, 200, result, "retrieving record(s) was successfully!"))
    .catch(err => fail(res, 500, `Error retrieving record(s). ${err.message}`));
}

// Retrieve a record with given id
export function findOne(req, res) {
  const recordId = req.params.recordId || "";
  if (!recordId) return fail(res, 400, "Why no userType as request parameter?");
  return db.findData("Access", recordId)
    .then((result) => {
      if (!result) return notFound(res, `Error: record not found for ${recordId}.`);
      return success(res, 200, result, `retrieving record was successfully for ${recordId}.`);
    })
    .catch(err => fail(res, 500, `Error retrieving record for ${recordId}. ${err.message}`));
}

/**
 * @description findSome
 * @param {Object} req http request object
 * @param {Object} res http request object returns
 * @requires {String} domainName as req parametr
 */
// Retrieve arrays/of/ids/?key=xyz123&pagination=true&size=all&limit=10&page=0&since=10
export function findSome(req, res) {
  const userType = req.params.userType || ""; // admin, vendor, customer, visitor
  const userIds = (req.params.userIds).split("/") || []; // Array of userIds
  if (!userType) return fail(res, 400, "Why no userType as request parameter?");
  if (!userIds) return fail(res, 400, "Why no userIds as request parameter?");
  // query
  let pagination = req.query.pagination || false; // true, false
  if (pagination == "true") pagination = true; // eslint-disable-line eqeqeq
  let page = Number(req.query.page) || 0;
  page = Math.max(0, page - 1); // using a zero-based page index for use with skip()
  let limit = Number(req.query.limit) || 10; // record size or counts/page to take
  if (limit < 10) limit = 10;
  if (limit > 100) limit = 100; // cap on 100 records/page
  const offset = page * limit; // skip number of records
  const since = Number(req.query.since) || 0; // only docs from the past 0 days
  const size = req.query.size || "all"; // one, some, or all records
  const dateFloor = dateDaysAgo(since);

  const filter = { pagination, size, dateFloor, limit, offset };

  return Access.findAccess(userType, userIds, filter)
    .then((result) => {
      if (!result) return notFound(res, `Error: record not found for ${userType}.`);
      return success(res, 200, result, `retrieving record was successfully for ${userType}.`);
    })
    .catch(err => fail(res, 500, `Error retrieving record for ${userType}. ${err.message}`));
}


// Create and Save a new record
export function create(req, res) {
  const data = req.body || {};
  // const { userId, userType } = res.locals;
  // const { accessDate, ipAddress } = getClientAccess(req);

  const newObject = {};

  newObject.userType = data.userType;
  newObject.userId = data.userId;
  newObject.accessId = `${generateId()}`;
  newObject.accessDate = data.accessDate;
  newObject.ipAddress = data.ipAddress;

  // const newRecord = cloneObject(Access.accessObject, newObject);

  // Save Product in the database
  return db.insertData("Access", [newObject])
    .then((result) => {
      if (!result) return notFound(res, "Error: newly submitted record not found");
      return success(res, 200, result, "New record has been created successfully!");
    })
    .catch(err => fail(res, 500, `Error creating record. ${err.message}`));
}

// Delete a vendor with the specified vendorId in the request
export async function destroy(req, res) {
  const recordId = req.params.recordId || "";
  const { userId, userType, userRole } = res.locals;
  if (!recordId) return fail(res, 400, "No record Id as request parameter");
  if (!isValidId(recordId)) return fail(res, 422, "Invalid record Id as request parameter");
  if (!userId || !userType || !userRole) return fail(res, 400, "Invalid authentication credentials");

  if (userType === "admin" && userRole === "super") {
    // we are cool!
  } else {
    return fail(res, 422, `Only Super Admin is allowed to delete record not ${userRole}`);
  }

  return db.deleteData("Access", [recordId])
    .then((record) => {
      if (!record) return notFound(res, `Record not found with id ${recordId}`);
      return success(res, 200, [], "Record deleted successfully!");
    })
    .catch(err => fail(res, 500, `Error: could not delete record with id ${recordId}. ${err.message}`));
}
