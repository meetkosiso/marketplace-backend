
import Report, { ObjectId } from "./model";
import { success, fail, notFound } from "./../../services/response";
import { dateDaysAgo } from "../../services/helpers/index";
import Order from "./../order/model";
import Stock from "./../stock/model";
import Ticket from "./../ticket/model";
import Review from "./../review/model";
import Transaction from "./../transaction/model";
import Approval from "./../approval/model";
import Advert from "./../advert/model";
import Coupon from "./../coupon/model";

// Retrieve a single record with a given recordId
export function generate(req, res) {
  const reportCode = ["SALES", "STOCK", "TICKET", "REVIEW", "TRANSACTION", "APPROVAL", "ADVERT", "COUPON"];
  const code = req.params.code || "";
  if (!code) return fail(res, 400, "No record Id as request parameter");
  if (!reportCode.includes(code)) return fail(res, 422, "Invalid record code as request parameter");

  const since = Number(req.query.since) || 0; // only docs from the past 0 days
  const from = Number(req.query.from) || ""; // only docs from the past 0 days
  const to = Number(req.query.to) || ""; // only docs from the past 0 days
  const dateFloor = dateDaysAgo(since);
  let Model;
  const filter = {};

  switch (code) {
    case "SALES": Model = Order;
      break;
    case "STOCK": Model = Stock;
      break;
    case "TICKET": Model = Ticket;
      break;
    case "REVIEW": Model = Review;
      break;
    case "TRANSACTION": Model = Transaction;
      break;
    case "APPROVAL": Model = Approval;
      break;
    case "ADVERT": Model = Advert;
      break;
    case "COUPON": Model = Coupon;
      break;
    default: return fail(res, 400, "No record Id as request parameter");
  }

  return Model.find(filter)
    .then((result) => {
      if (!result) return notFound(res, `Error: record not found with id ${code}.`);
      return success(res, 200, result, `retrieving record was successfully with id ${code}.`);
    }).catch((err) => {
      if (err.kind === "ObjectId") {
        notFound(res, `Error retrieving record with id ${code}. ${err.message}`);
      }
      return fail(res, 500, `Error retrieving record with id ${code}. ${err.message}`);
    });
}


// Retrieve and return all records from the database.
export function findAll(req, res) {
  return Report.find()
    .then(result => success(res, 200, result, "retrieving record(s) was successfully!"))
    .catch(err => fail(res, 500, `Error retrieving record(s).\r\n${err.message}`));
}

// Retrieve a single record with a given recordId
export function findOne(req, res) {
  const recordId = req.params.reportId || "";
  if (!recordId) return fail(res, 400, "No record Id as request parameter");
  if (!ObjectId.isValid(recordId)) return fail(res, 422, "Invalid record Id as request parameter");
  return Report.findById(recordId)
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
  let adminId;

  if (userType === "admin") {
    adminId = userId;
  } else {
    return fail(res, 422, `Only admins are allowed to update this record not ${userType}`);
  }

  // Validate request
  if (!data.code) return fail(res, 422, "code cannot be empty.");
  if (!data.name) return fail(res, 422, "name cannot be empty");
  if (!data.description) return fail(res, 422, "description cannot be empty");

  const newObject = {};
  newObject.admin = adminId;
  if (!data.code) newObject.code = data.code;
  if (!data.name) newObject.name = data.name;
  if (!data.description) newObject.description = data.description;

  // Create a record
  const record = new Report(newObject);

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
  const recordId = req.params.reviewId || "";
  if (!recordId) return fail(res, 400, "No record Id as request parameter");
  if (!ObjectId.isValid(recordId)) return fail(res, 422, "Invalid record Id as request parameter");
  const data = req.body || {};
  const { userId, userType } = res.locals;
  let adminId;

  if (userType === "admin") {
    adminId = userId;
  } else {
    return fail(res, 422, `Only admins are allowed to update this record not ${userType}`);
  }

  // Validate request
  if (!data.code) return fail(res, 422, "code cannot be empty.");
  if (!data.name) return fail(res, 422, "name cannot be empty");
  if (!data.description) return fail(res, 422, "description cannot be empty");

  const newObject = {};
  newObject.admin = adminId;
  if (!data.code) newObject.code = data.code;
  if (!data.name) newObject.name = data.name;
  if (!data.description) newObject.description = data.description;

  // Find record and update it with id
  return Report.findByIdAndUpdate(recordId, newObject, { new: true })
    .then((result) => {
      if (!result) return notFound(res, `Error: newly submitted record not found with id ${recordId}`);
      return success(res, 200, result, "New record has been created successfully!");
    })
    .catch(err => fail(res, 500, `Error updating record with id ${recordId}.\r\n${err.message}`));
}


// Delete a report with the specified reportId in the request
export async function destroy(req, res) {
  const recordId = req.params.reportId || "";
  if (!recordId) return fail(res, 400, "No record Id as request parameter");
  if (!ObjectId.isValid(recordId)) return fail(res, 422, "Invalid record Id as request parameter");
  return Report.findByIdAndRemove(recordId)
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
