
import _ from "underscore";
import Template, { ObjectId } from "./model";
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
  if (!data.name) return fail(res, 422, "Template name cannot be empty.");
  if (!data.page) return fail(res, 422, "Template page cannot be empty");
  if (!(["notification", "theme", "home", "profile", "product", "details", "invoice", "ticket", "newsletter", "mail"].includes(data.page))) {
    return fail(res, 422, "slide page must be either of product, brand, category or blog.");
  }
  if (!data.style) return fail(res, 422, "Template style cannot be empty");

  const newObject = {};
  newObject.admin = adminId;
  if (data.name) newObject.name = data.name;
  if (data.page) newObject.page = data.page;
  if (data.icon) newObject.icon = data.icon;
  if (data.style) newObject.style = _.escape(data.style);
  if (data.placeholders) newObject.placeholders = data.placeholders;

  // Create a record
  const record = new Template(newObject);

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
  return Template.find()
    .populate({ path: "admin", select: "id fullname" })
    .then(result => success(res, 200, result, "retrieving record(s) was successfully!"))
    .catch(err => fail(res, 500, `Error retrieving record(s).\r\n${err.message}`));
}

// Retrieve a single record with a given recordId
export function findOne(req, res) {
  const recordId = req.params.templateId || "";
  if (!recordId) return fail(res, 400, "No record Id as request parameter");
  if (!ObjectId.isValid(recordId)) return fail(res, 422, "Invalid record Id as request parameter");
  return Template.findById(recordId)
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
  const recordId = req.params.templateId || "";
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
  if (!data.name) return fail(res, 422, "Template name cannot be empty.");
  if (!data.page) return fail(res, 422, "Template page cannot be empty");
  if (!(["notification", "theme", "home", "profile", "product", "details", "invoice", "ticket", "newsletter", "mail"].includes(data.page))) {
    return fail(res, 422, "slide page must be either of product, brand, category or blog.");
  }
  if (!data.icon) return fail(res, 422, "Template icon cannot be empty");
  if (!data.style) return fail(res, 422, "Template style cannot be empty");
  if (!data.placeholders) return fail(res, 422, "Template placeholders must be of type Array");
  if (!data.placeholders.isArray()) return fail(res, 422, "Template placeholders must be of type Array");

  const newObject = {};
  newObject.admin = adminId;
  if (!data.name) newObject.name = data.name;
  if (!data.page) newObject.page = data.page;
  if (!data.icon) newObject.icon = data.icon;
  if (!data.style) newObject.style = _.escape(data.style);
  if (!data.placeholders) newObject.placeholders = data.placeholders;

  // Find record and update it with id
  return Template.findByIdAndUpdate(recordId, newObject, { new: true })
    .populate({ path: "admin", select: "id fullname" })
    .then((result) => {
      if (!result) return notFound(res, `Error: newly submitted record not found with id ${recordId}`);
      return success(res, 200, result, "New record has been created successfully!");
    })
    .catch(err => fail(res, 500, `Error updating record with id ${recordId}.\r\n${err.message}`));
}

// Delete a template with the specified templateId in the request
export async function destroy(req, res) {
  const recordId = req.params.templateId || "";
  if (!recordId) return fail(res, 400, "No record Id as request parameter");
  if (!ObjectId.isValid(recordId)) return fail(res, 422, "Invalid record Id as request parameter");
  return Template.findByIdAndRemove(recordId)
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
