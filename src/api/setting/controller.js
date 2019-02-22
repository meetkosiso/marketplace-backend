
import Setting, { ObjectId } from "./model";
import { success, fail, notFound } from "./../../services/response";


/**
 * @description findSetting() get a particular setting record
 * @param {String} code of a particular setting
 */
export function findSetting(code) {
  return Setting
    .findOne({ code })
    .then((result) => {
      if (!result) return false;
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
    return fail(res, 422, `Only admins are allowed to update this record not ${userType}`);
  }

  // Validate request
  if (!data.code) return fail(res, 422, "code cannot be empty.");
  if (!data.kind) return fail(res, 422, "kind cannot be empty");
  if (!(["system", "users", "operations"].indexOf(data.kind) >= 0)) {
    return fail(res, 422, "kind must be either of system, users, operations.");
  }
  if (!data.name) return fail(res, 422, "name cannot be empty");
  if (!data.value) return fail(res, 422, "value cannot be empty");
  if (!data.description) return fail(res, 422, "description cannot be empty");

  const newObject = {};
  newObject.admin = adminId;
  if (!data.code) newObject.code = data.code;
  if (!data.kind) newObject.kind = data.kind;
  if (!data.name) newObject.name = data.name;
  if (!data.value) newObject.value = data.value;
  if (!data.description) newObject.description = data.description;

  // Create a record
  const record = new Setting(newObject);

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
  return Setting.find()
    .then(result => success(res, 200, result, "retrieving record(s) was successfully!"))
    .catch(err => fail(res, 500, `Error retrieving record(s).\r\n${err.message}`));
}

// Retrieve a single record with a given recordId
export function findOne(req, res) {
  const recordId = req.params.settingId || "";
  if (!recordId) return fail(res, 400, "No record Id as request parameter");
  if (!ObjectId.isValid(recordId)) return fail(res, 422, "Invalid record Id as request parameter");
  return Setting.findById(recordId)
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
  const { userId, userType } = res.locals;
  let adminId;

  if (userType === "admin") {
    adminId = userId;
  } else {
    return fail(res, 422, `Only admins are allowed to update this record not ${userType}`);
  }

  // Validate request
  if (!data.code) return fail(res, 422, "code cannot be empty.");
  if (!data.kind) return fail(res, 422, "kind cannot be empty");
  if (!(["system", "users", "operations"].indexOf(data.kind) >= 0)) {
    return fail(res, 422, "kind must be either of system, users, operations.");
  }
  if (!data.name) return fail(res, 422, "name cannot be empty");
  if (!data.value) return fail(res, 422, "value cannot be empty");
  if (!data.description) return fail(res, 422, "description cannot be empty");

  const newObject = {};
  newObject.admin = adminId;
  if (!data.code) newObject.code = data.code;
  if (!data.kind) newObject.kind = data.kind;
  if (!data.name) newObject.name = data.name;
  if (!data.value) newObject.value = data.value;
  if (!data.description) newObject.description = data.description;

  // Find record and update it with id
  return Setting.findByIdAndUpdate(recordId, newObject, { new: true })
    .then((result) => {
      if (!result) return notFound(res, `Error: newly submitted record not found with id ${recordId}`);
      return success(res, 200, result, "New record has been created successfully!");
    })
    .catch(err => fail(res, 500, `Error updating record with id ${recordId}.\r\n${err.message}`));
}


// Delete a setting with the specified settingId in the request
export async function destroy(req, res) {
  const recordId = req.params.settingId || "";
  if (!recordId) return fail(res, 400, "No record Id as request parameter");
  if (!ObjectId.isValid(recordId)) return fail(res, 422, "Invalid record Id as request parameter");
  return Setting.findByIdAndRemove(recordId)
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
