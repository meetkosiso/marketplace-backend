
import Mail, { ObjectId } from "./model";
import { success, fail, notFound } from "./../../services/response";
import sendMail from "../../services/helpers/EmailConfiguration";

// Create and Save a new record
export function create(req, res) {
  const data = req.body || {};
  const { userId, userType } = res.locals;

  if (userType === "admin" || userType === "vendor") {
    // ignore
  } else {
    return fail(res, 422, `Only admins are allowed to update this record not ${userType}`);
  }

  // Validate request
  if (!data.name) return fail(res, 422, "name cannot be empty.");
  if (!data.kind) return fail(res, 422, "kind cannot be empty.");
  if (!data.mailSubject) return fail(res, 422, "mailSubject cannot be empty.");
  if (!data.mailBody && !data.template) return fail(res, 422, "mailBody or mail template cannot be empty.");
  if (!data.recipient) return fail(res, 422, "recipient cannot be empty.");
  sendMail(
    "ifeoluwa odewale",
    "ifeoluwa.odewale@gmail.com",
    "odu veronica",
    "oduveronica22@gmail.com",
    "notification",
    "Email Verification",
    {
      name: "Odewale Ifeoluwa",
      link: "http://bezop.com/uniquelink",
    },
  );
  const newObject = {};
  newObject.createdBy = userId;
  newObject.createdType = userType;
  if (data.name) newObject.name = data.name;
  if (data.kind) newObject.kind = data.kind;
  if (data.mailSubject) newObject.mailSubject = data.mailSubject;
  if (data.mailBody) newObject.mailBody = data.mailBody;
  if (data.recipient) newObject.recipient = data.recipient;

  // Create a record
  const record = new Mail(newObject);

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
  return Mail.find()
    .then(result => success(res, 200, result, "retrieving record(s) was successfully!"))
    .catch(err => fail(res, 500, `Error retrieving record(s).\r\n${err.message}`));
}

// Retrieve a single record with a given recordId
export function findOne(req, res) {
  const recordId = req.params.mailId || "";
  if (!recordId) return fail(res, 400, "No record Id as request parameter");
  if (!ObjectId.isValid(recordId)) return fail(res, 422, "Invalid record Id as request parameter");
  return Mail.findById(recordId)
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
  const recordId = req.params.mailId || "";
  if (!recordId) return fail(res, 400, "No record Id as request parameter");
  if (!ObjectId.isValid(recordId)) return fail(res, 422, "Invalid record Id as request parameter");
  const data = req.body || {};
  const { userId, userType } = res.locals;

  if (userType === "admin" || userType === "vendor") {
    // ignore
  } else {
    return fail(res, 422, `Only admins are allowed to update this record not ${userType}`);
  }

  // Validate request
  if (!data.name) return fail(res, 422, "name cannot be empty.");
  if (!data.kind) return fail(res, 422, "kind cannot be empty.");
  if (!data.mailSubject) return fail(res, 422, "mailSubject cannot be empty.");
  if (!data.mailBody && !data.template) return fail(res, 422, "mailBody or mail template cannot be empty.");
  if (!data.recipient) return fail(res, 422, "recipient cannot be empty.");

  const newObject = {};
  newObject.createdBy = userId;
  newObject.createdType = userType;
  if (data.name) newObject.name = data.name;
  if (data.kind) newObject.kind = data.kind;
  if (data.language) newObject.language = data.language;
  if (data.mailSubject) newObject.mailSubject = data.mailSubject;
  if (data.mailBody) newObject.mailBody = data.mailBody;
  if (data.recipient) newObject.recipient = data.recipient;

  // Find record and update it with id
  return Mail.findByIdAndUpdate(recordId, { ...newObject }, { new: true })
    .then((result) => {
      if (!result) return notFound(res, `Error: newly submitted record not found with id ${recordId}`);
      return success(res, 200, result, "New record has been created successfully!");
    })
    .catch(err => fail(res, 500, `Error updating record with id ${recordId}.\r\n${err.message}`));
}

// Delete a mail with the specified mailId in the request
export async function destroy(req, res) {
  const recordId = req.params.mailId || "";
  // Validate request
  if (!recordId) return fail(res, 400, "Invalid record Id as request parameter");
  return Mail.findByIdAndRemove(recordId)
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

export async function testing(req, res) {
  const result = await sendMail(
    "ifeoluwa odewale",
    "ifeoluwa.odewale@gmail.com",
    "notification",
    "odu veronica",
    "oduveronica22@gmail.com",
    "Email Verification",
    {
      name: "Odewale Ifeoluwa",
      link: "http://bezop.com/uniquelink",
    },
  );
  res.json(result);
}
