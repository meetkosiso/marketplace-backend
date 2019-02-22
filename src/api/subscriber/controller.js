
import Subscriber, { ObjectId } from "./model";
import { success, fail, notFound } from "./../../services/response";

// Create and Save a new record
export function create(req, res) {
  const data = req.body || {};
  // Validate request
  if (!ObjectId.isValid(data.vendor)) return fail(res, 422, "Invalid vendor Id");
  if (!data.email) return fail(res, 422, "Subscriber email cannot be empty.");
  if (!data.frequency) return fail(res, 422, "Subscription frequency cannot be empty.");
  if (!data.interest) return fail(res, 422, "Subscriber interest cannot be empty");

  const newObject = {};
  newObject.vendor = data.vendor;
  if (!data.email) newObject.email = data.email;
  if (!data.frequency) newObject.frequency = data.frequency;
  if (!data.interest) newObject.interest = data.interest;

  // Create a record
  const record = new Subscriber(newObject);

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
  return Subscriber.find()
    .then(result => success(res, 200, result, "retrieving record(s) was successfully!"))
    .catch(err => fail(res, 500, `Error retrieving record(s).\r\n${err.message}`));
}

// Retrieve a single record with a given recordId
export function findOne(req, res) {
  const recordId = req.params.subscriberId || "";
  if (!recordId) return fail(res, 400, "No record Id as request parameter");
  if (!ObjectId.isValid(recordId)) return fail(res, 422, "Invalid record Id as request parameter");
  return Subscriber.findById(recordId)
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

// Update record identified by the Id in the request
export function update(req, res) {
  const recordId = req.params.reviewId || "";
  if (!recordId) return fail(res, 400, "No record Id as request parameter");
  if (!ObjectId.isValid(recordId)) return fail(res, 422, "Invalid record Id as request parameter");
  const data = req.body || {};
  // Validate request
  if (!data.email) return fail(res, 422, "Subscriber email cannot be empty.");
  if (!data.frequency) return fail(res, 422, "Subscription frequency cannot be empty.");
  if (!data.interest) return fail(res, 422, "Subscriber interest cannot be empty");

  const newObject = {};
  if (!data.email) newObject.email = data.email;
  if (!data.frequency) newObject.frequency = data.frequency;
  if (!data.interest) newObject.interest = data.interest;

  // Find record and update it with id
  return Subscriber.findByIdAndUpdate(recordId, newObject, { new: true })
    .then((result) => {
      if (!result) return notFound(res, `Error: newly submitted record not found with id ${recordId}`);
      return success(res, 200, result, "New record has been created successfully!");
    })
    .catch(err => fail(res, 500, `Error updating record with id ${recordId}.\r\n${err.message}`));
}

// unsubscribe from newsletter identified by the Id of subscription and vendor
export function unsubscribe(req, res) {
  const recordId = req.params.subscriberId || "";
  const vendorId = req.params.vendorId || "";
  if (!recordId) return fail(res, 400, "No record Id as request parameter");
  if (!ObjectId.isValid(recordId)) return fail(res, 422, "Invalid record Id as request parameter");
  const data = req.body || {};
  // Validate request
  // if (!data.email) return fail(res, 422, "Subscriber email cannot be empty.");

  return Subscriber.findOneAndUpdate(
    { _id: recordId },
    { $pull: { vendors: vendorId } }, (error, savedRecord) => {
      if (error) {
        console.log(error);
        return fail(res, 500, `Failed to unsubscribe with id ${recordId}. ${error.message}`);
      }
      return success(res, 200, savedRecord, "Record deleted successfully!");
    })
    .catch((err) => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return notFound(res, `Error: record not found with id ${recordId}\r\n${err.message}`);
      }
      return fail(res, 500, `Error: could not delete record with id ${recordId}\r\n${err.message}`);
    });
}

// Delete a subscriber with the specified subscriberId in the request
export async function destroy(req, res) {
  const recordId = req.params.subscriberId || "";
  if (!recordId) return fail(res, 400, "No record Id as request parameter");
  if (!ObjectId.isValid(recordId)) return fail(res, 422, "Invalid record Id as request parameter");
  return Subscriber.findByIdAndRemove(recordId)
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
