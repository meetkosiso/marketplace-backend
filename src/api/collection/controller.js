
import Collection, { ObjectId } from "./model";
import { success, fail, notFound } from "./../../services/response";


// Retrieve and return all records from the database.
export function findAll(req, res) {
  return Collection.find()
    .populate({ path: "review", select: "id subjectId comment rating", match: { standing: "active" } })
    .populate({ path: "vendor", select: "id url businessName domainName", match: { standing: "active" } })
    .then(result => success(res, 200, result, "retrieving record(s) was successfully!"))
    .catch(err => fail(res, 500, `Error retrieving record(s). ${err.message}`));
}


// Retrieve a single record with a given recordId
export function findOne(req, res) {
  const recordId = req.params.collectionId || "";
  if (!recordId) return fail(res, 400, "No record Id as request parameter");
  if (!ObjectId.isValid(recordId)) return fail(res, 422, "Invalid record Id as request parameter");
  return Collection.findById(recordId)
    .populate({ path: "review", select: "id subjectId comment rating", match: { standing: "active" } })
    .populate({ path: "vendor", select: "id url businessName domainName", match: { standing: "active" } })
    .then((result) => {
      if (!result) return notFound(res, "Error record not found.");
      return success(res, 200, result, "retrieving record was successfully!");
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        notFound(res, `Error retrieving record. ${err.message}`);
      }
      return fail(res, 500, `Error retrieving record. ${err.message}`);
    });
}

// Create and Save a new record
export function create(req, res) {
  const data = req.body || {};
  const { userId, userType } = res.locals;

  // Validate request
  if (!data.name) return fail(res, 422, "name cannot be empty and must be alphanumeric.");
  if (!data.description) return fail(res, 422, "description cannot be empty and must be alphanumeric.");
  if (!data.kind) return fail(res, 422, "kind cannot be empty and must be alphanumeric.");

  const newObject = {};
  newObject.admin = userId;
  if (data.parent) newObject.parent = data.parent;
  if (data.name) newObject.name = data.name;
  if (data.description) newObject.description = data.description;
  if (data.kind) newObject.kind = data.kind;

  // Create a record
  const record = new Collection(newObject);

  // Save Product in the database
  return record.save()
    .then((result) => {
      if (!result) return notFound(res, "Error: newly submitted record not found");
      return success(res, 200, result, "New record has been created successfully!");
    })
    .catch(err => fail(res, 500, `Error creating record. ${err.message}`));
}


// Update record identified by the Id in the request
export function update(req, res) {
  const recordId = req.params.collectionId || "";
  if (!recordId) return fail(res, 400, "No record Id as request parameter");
  if (!ObjectId.isValid(recordId)) return fail(res, 422, "Invalid record Id as request parameter");
  const data = req.body || {};
  const { userId, userType } = res.locals;

  // Validate request
  if (!data.name) return fail(res, 422, "name cannot be empty and must be alphanumeric.");
  if (!data.description) return fail(res, 422, "description cannot be empty and must be alphanumeric.");
  if (!data.kind) return fail(res, 422, "kind cannot be empty and must be alphanumeric.");

  const newObject = {};
  newObject.admin = userId;
  if (data.parent) newObject.parent = data.parent;
  if (data.name) newObject.name = data.name;
  if (data.description) newObject.description = data.description;
  if (data.kind) newObject.kind = data.kind;


  // Find record and update it with id
  return Collection.findByIdAndUpdate(recordId, newObject, { new: true })
    .then((result) => {
      if (!result) return notFound(res, `Error: newly submitted record not found with id ${recordId}`);
      return success(res, 200, result, "New record has been created successfully!");
    })
    .catch(err => fail(res, 500, `Error updating record with id ${recordId}. ${err.message}`));
}

// Delete a collection with the specified collectionId in the request
export async function destroy(req, res) {
  const recordId = req.params.collectionId || "";
  if (!recordId) return fail(res, 400, "No record Id as request parameter");
  if (!ObjectId.isValid(recordId)) return fail(res, 422, "Invalid record Id as request parameter");
  if (!recordId) return fail(res, 400, "Invalid record Id as request parameter");
  return Collection.findByIdAndRemove(recordId)
    .then((record) => {
      if (!record) return notFound(res, `Record not found with id ${recordId}`);
      return success(res, 200, [], "Record deleted successfully!");
    })
    .catch((err) => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return notFound(res, `Error: record not found with id ${recordId} ${err.message}`);
      }
      return fail(res, 500, `Error: could not delete record with id ${recordId} ${err.message}`);
    });
}
