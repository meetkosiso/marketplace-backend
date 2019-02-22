
import Category, { ObjectId } from "./model";
import { success, fail, notFound } from "./../../services/response";
import { findVendorByDomain, findVendorById } from "./../vendor/controller";


// Find searched Category
export function searchCategory(quest) {
  return new Promise((resolve, reject) => Category.search(
    { query_string: { query: quest } },
    (err, results) => {
      if (!err) resolve(results);
      reject(err);
    },
  ));
}

// Find searched Category
export async function search(req, res) {
  const quest = req.query.q || "";
  if (!quest) return fail(res, 422, `Why incorrect query string ${quest}?`);
  const results = await searchCategory(quest);
  const records = results.hits.hits;
  const counts = parseInt(results.hits.total, 10);
  if (!(counts > 0)) return notFound(res, `${counts} record found!`);
  // Substitute vendor id with vendor object
  return Promise.all(results.hits.hits.map(async (record) => {
    record._source.vendorDetails = await findVendorById(record._source.vendor); // eslint-disable-line
  })).then(() => success(res, 200, records, `retrieved ${counts} record(s) successfully!`));
}

// Retrieve and return all records from the database.
export function findAll(req, res) {
  return Category.find()
    .populate({ path: "review", select: "id subjectId comment rating", match: { standing: "active" } })
    .populate({ path: "vendor", select: "id url businessName domainName", match: { standing: "active" } })
    .populate({ path: "collection", select: "id name kind description", match: { standing: "active" } })
    .then(result => success(res, 200, result, "retrieving record(s) was successfully!"))
    .catch(err => fail(res, 500, `Error retrieving record(s).\r\n${err.message}`));
}

// Get all categories of a single vendor
export async function findVendorCategories(req, res) {
  const { vendorDomain } = req.params;
  // console.log("\r\n\r\nvendorDomain, kind ", vendorDomain, kind);
  if (!vendorDomain) return fail(res, 422, "Vendor shop has not been specified.");

  let vendorId;

  const vendor = await findVendorByDomain(vendorDomain);

  if (vendor && vendor.id) {
    vendorId = vendor.id;
  } else {
    return fail(res, 422, "Error: unknown vendor.");
  }

  return Category.find({ vendor: vendorId })
    .populate({ path: "review", select: "id subjectId comment rating", match: { standing: "active" } })
    .populate({ path: "vendor", select: "id url businessName domainName", match: { standing: "active" } })
    .populate({ path: "collection", select: "id name kind description", match: { standing: "active" } })
    .then(result => success(res, 200, result, "retrieving record(s) was successfully!"))
    .catch(err => fail(res, 500, `Error retrieving record(s).\r\n${err.message}`));
}

// Retrieve a single record with a given recordId
export function findOne(req, res) {
  const recordId = req.params.categoryId || "";
  if (!recordId) return fail(res, 400, "No record Id as request parameter");
  if (!ObjectId.isValid(recordId)) return fail(res, 422, "Invalid record Id as request parameter");
  return Category.findById(recordId)
    .populate({ path: "review", select: "id subjectId comment rating", match: { standing: "active" } })
    .populate({ path: "vendor", select: "id url businessName domainName", match: { standing: "active" } })
    .populate({ path: "collection", select: "id name kind description", match: { standing: "active" } })
    .then((result) => {
      if (!result) return notFound(res, "Error record not found.");
      return success(res, 200, result, "retrieving record was successfully!");
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        notFound(res, `Error retrieving record.\r\n${err.message}`);
      }
      return fail(res, 500, `Error retrieving record.\r\n${err.message}`);
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
  if (!data.collections) return fail(res, 422, "Why no collections (main category)?");

  const newObject = {};
  newObject.vendor = userId;
  newObject.collections = data.collections;
  if (data.parent) newObject.parent = data.parent;
  if (data.name) newObject.name = data.name;
  if (data.description) newObject.description = data.description;
  if (data.kind) newObject.kind = data.kind;

  // Create a record
  const record = new Category(newObject);

  // Save Product in the database
  return record.save()
    .then((result) => {
      if (!result) return notFound(res, "Error: newly submitted record not found");
      result.on("es-indexed", (err) => {
        if (err) console.log(`Error indexing record ${err.message}`);
        console.log("New category index has been created successfully!");
      });
      return success(res, 200, result, "New record has been created successfully!");
    })
    .catch(err => fail(res, 500, `Error creating record.\r\n${err.message}`));
}


// Update record identified by the Id in the request
export function update(req, res) {
  const recordId = req.params.categoryId || "";
  if (!recordId) return fail(res, 400, "No record Id as request parameter");
  if (!ObjectId.isValid(recordId)) return fail(res, 422, "Invalid record Id as request parameter");
  const data = req.body || {};
  const { userId, userType } = res.locals;

  // Validate request
  if (!data.name) return fail(res, 422, "name cannot be empty and must be alphanumeric.");
  if (!data.description) return fail(res, 422, "description cannot be empty and must be alphanumeric.");
  if (!data.kind) return fail(res, 422, "kind cannot be empty and must be alphanumeric.");
  if (!data.collections) return fail(res, 422, "Why no collections (main category)?");

  const newObject = {};
  newObject.vendor = userId;
  newObject.collections = data.collections;
  if (data.parent) newObject.parent = data.parent;
  if (data.name) newObject.name = data.name;
  if (data.description) newObject.description = data.description;
  if (data.kind) newObject.kind = data.kind;


  // Find record and update it with id
  return Category.findByIdAndUpdate(recordId, newObject, { new: true })
    .then((result) => {
      if (!result) return notFound(res, `Error: newly submitted record not found with id ${recordId}`);
      return success(res, 200, result, "New record has been created successfully!");
    })
    .catch(err => fail(res, 500, `Error updating record with id ${recordId}.\r\n${err.message}`));
}

// Patch record identified by the Id in the request
export function modify(req, res) {
  const recordId = req.params.categoryId || "";
  if (!recordId) return fail(res, 400, "No record Id as request parameter");
  if (!ObjectId.isValid(recordId)) return fail(res, 422, "Invalid record Id as request parameter");
  const data = req.body || {};
  const { userId, userType } = res.locals;

  if (userType !== "admin") {
    return fail(res, 422, `Only admins are allowed to update this record not ${userType}`);
  }

  // Validate request
  if (!data.standing) return fail(res, 422, "Why no standing?");
  if (!data.action) return fail(res, 422, "Why no administrative action?");

  const newObject = {};
  newObject.admin = userId;
  if (data.standing) newObject.standing = data.standing;
  if (data.action) newObject.action = data.action;

  // Find record and update it with id
  return Category.findByIdAndUpdate(recordId, newObject, { new: true })
    .then((result) => {
      if (!result) return notFound(res, `Error: newly submitted record not found with id ${recordId}`);
      return success(res, 200, result, "New record has been created successfully!");
    })
    .catch(err => fail(res, 500, `Error updating record with id ${recordId}.\r\n${err.message}`));
}


// Delete a category with the specified categoryId in the request
export async function destroy(req, res) {
  const recordId = req.params.categoryId || "";
  if (!recordId) return fail(res, 400, "No record Id as request parameter");
  if (!ObjectId.isValid(recordId)) return fail(res, 422, "Invalid record Id as request parameter");
  if (!recordId) return fail(res, 400, "Invalid record Id as request parameter");
  return Category.findByIdAndRemove(recordId)
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
