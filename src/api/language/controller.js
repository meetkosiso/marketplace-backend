
import Language, { ObjectId } from "./model";
import { success, fail, notFound } from "./../../services/response";

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
  if (!data.phrase) return fail(res, 422, "phrase cannot be empty.");
  if (!data.english) return fail(res, 422, "english cannot be empty.");
  if (!data.french) return fail(res, 422, "french cannot be empty.");
  if (!data.spanish) return fail(res, 422, "spanish cannot be empty.");
  if (!data.bangla) return fail(res, 422, "bangla cannot be empty.");
  if (!data.arabic) return fail(res, 422, "arabic cannot be empty.");
  if (!data.chinese) return fail(res, 422, "chinese cannot be empty.");

  const newObject = {};
  newObject.admin = adminId;
  if (data.phrase) newObject.phrase = data.phrase;
  if (data.english) newObject.english = data.english;
  if (data.french) newObject.french = data.french;
  if (data.spanish) newObject.spanish = data.spanish;
  if (data.bangla) newObject.bangla = data.bangla;
  if (data.arabic) newObject.arabic = data.arabic;
  if (data.chinese) newObject.chinese = data.chinese;

  // Create a record
  const record = new Language(newObject);

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
  return Language.find()
    .then(result => success(res, 200, result, "retrieving record(s) was successfully!"))
    .catch(err => fail(res, 500, `Error retrieving record(s).\r\n${err.message}`));
}

// Retrieve a single record with a given recordId
export function findOne(req, res) {
  const recordId = req.params.languageId || "";
  if (!recordId) return fail(res, 400, "No record Id as request parameter");
  if (!ObjectId.isValid(recordId)) return fail(res, 422, "Invalid record Id as request parameter");
  return Language.findById(recordId)
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
  const recordId = req.params.couponId || "";
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
  if (!data.phrase) return fail(res, 422, "phrase cannot be empty.");
  if (!data.english) return fail(res, 422, "english cannot be empty.");
  if (!data.french) return fail(res, 422, "french cannot be empty.");
  if (!data.spanish) return fail(res, 422, "spanish cannot be empty.");
  if (!data.bangla) return fail(res, 422, "bangla cannot be empty.");
  if (!data.arabic) return fail(res, 422, "arabic cannot be empty.");
  if (!data.chinese) return fail(res, 422, "chinese cannot be empty.");

  const newObject = {};
  newObject.admin = adminId;
  if (data.phrase) newObject.phrase = data.phrase;
  if (data.english) newObject.english = data.english;
  if (data.french) newObject.french = data.french;
  if (data.spanish) newObject.spanish = data.spanish;
  if (data.bangla) newObject.bangla = data.bangla;
  if (data.arabic) newObject.arabic = data.arabic;
  if (data.chinese) newObject.chinese = data.chinese;

  // Find record and update it with id
  return Language.findByIdAndUpdate(recordId, { ...newObject }, { new: true })
    .then((result) => {
      if (!result) return notFound(res, `Error: newly submitted record not found with id ${recordId}`);
      return success(res, 200, result, "New record has been created successfully!");
    })
    .catch(err => fail(res, 500, `Error updating record with id ${recordId}.\r\n${err.message}`));
}

// Delete a language with the specified languageId in the request
export async function destroy(req, res) {
  const recordId = req.params.languageId || "";
  if (!recordId) return fail(res, 400, "No record Id as request parameter");
  if (!ObjectId.isValid(recordId)) return fail(res, 422, "Invalid record Id as request parameter");
  return Language.findByIdAndRemove(recordId)
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
