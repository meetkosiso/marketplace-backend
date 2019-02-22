
import Brand, { ObjectId } from "./model";
import { success, fail, notFound } from "./../../services/response";
import { findVendorByDomain, findVendorById } from "./../vendor/controller";


// Find searched Brand
export function searchBrand(quest) {
  return new Promise((resolve, reject) => Brand.search(
    { query_string: { query: quest } },
    (err, results) => {
      if (!err) resolve(results);
      reject(err);
    },
  ));
}

// Find searched Brand
export async function search(req, res) {
  const quest = req.query.q || "";
  if (!quest) return fail(res, 422, `Why incorrect query string ${quest}?`);
  const results = await searchBrand(quest);
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
  return Brand.find()
    .populate({ path: "review", select: "id subjectId comment rating", match: { standing: "active" } })
    .populate({ path: "vendor", select: "id url businessName domainName", match: { standing: "active" } })
    .then(result => success(res, 200, result, "retrieving record(s) was successfully!"))
    .catch(err => fail(res, 500, `Error retrieving record(s).\r\n${err.message}`));
}

// Get all brand of a single vendor
export async function findVendorBrands(req, res) {
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

  return Brand.find({ vendor: vendorId })
    .populate({ path: "review", select: "id subjectId comment rating", match: { standing: "active" } })
    .populate({ path: "vendor", select: "id url businessName domainName", match: { standing: "active" } })
    .then(result => success(res, 200, result, "retrieving record(s) was successfully!"))
    .catch(err => fail(res, 500, `Error retrieving record(s).\r\n${err.message}`));
}

// Retrieve a single record with a given recordId
export function findOne(req, res) {
  const recordId = req.params.brandId || "";
  if (!recordId) return fail(res, 400, "No record Id as request parameter");
  if (!ObjectId.isValid(recordId)) return fail(res, 422, "Invalid record Id as request parameter");
  return Brand.findById(recordId)
    .populate({ path: "vendor", select: "id url businessName domainName", match: { standing: "active" } })
    .then((result) => {
      if (!result) return notFound(res, "Error record not found.");
      return success(res, 200, result, "retrieving record was successfully!");
    }).catch((err) => {
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
  let vendorId;

  if (userType === "vendor") {
    vendorId = userId;
  } else {
    return fail(res, 422, `Only vendors are allowed to add media not ${userType}`);
  }

  // Validate request
  if (!data.name) return fail(res, 422, "name cannot be empty and must be alphanumeric.");
  if (!data.description) return fail(res, 422, "description cannot be empty and must be alphanumeric.");

  const newObject = {};
  newObject.vendor = vendorId;
  if (data.name) newObject.name = data.name;
  if (data.description) newObject.description = data.description;

  // Create a record
  const record = new Brand(newObject);

  // Save Product in the database
  return record.save()
    .then((result) => {
      if (!result) return notFound(res, "Error: newly submitted record not found");
      result.on("es-indexed", (err) => {
        if (err) console.log(`Error indexing record ${err.message}`);
        console.log("New brand index has been created successfully!");
      });
      return success(res, 200, result, "New record has been created successfully!");
    })
    .catch(err => fail(res, 500, `Error creating record.\r\n${err.message}`));
}


// Update a brand identified by the brandId in the request
export function update(req, res) {
  const recordId = req.params.brandId || "";
  if (!recordId) return fail(res, 400, "No record Id as request parameter");
  if (!ObjectId.isValid(recordId)) return fail(res, 422, "Invalid record Id as request parameter");
  const data = req.body || {};
  const { userId, userType } = res.locals;
  let vendorId;

  if (userType === "vendor") {
    vendorId = userId;
  } else {
    return fail(res, 422, `Only vendors are allowed to add media not ${userType}`);
  }

  // Validate request
  if (!data.name) return fail(res, 422, "name cannot be empty and must be alphanumeric.");
  if (!data.description) return fail(res, 422, "description cannot be empty and must be alphanumeric.");

  const newObject = {};
  newObject.vendor = vendorId;
  if (data.name) newObject.name = data.name;
  if (data.description) newObject.description = data.description;

  // Find brand and update it with the request body
  return Brand.findByIdAndUpdate(recordId, newObject, { new: true })
    .then((result) => {
      if (!result) return notFound(res, `Error: newly submitted record not found with id ${recordId}`);
      return success(res, 200, result, "New record has been created successfully!");
    })
    .catch(err => fail(res, 500, `Error updating record with id ${recordId}.\r\n${err.message}`));
}

// Patch a brand identified by the brandId in the request
export function modify(req, res) {
  const recordId = req.params.brandId || "";
  if (!recordId) return fail(res, 400, "No record Id as request parameter");
  if (!ObjectId.isValid(recordId)) return fail(res, 422, "Invalid record Id as request parameter");
  const data = req.body || {};
  const { userId, userType } = res.locals;
  let vendorId;

  if (userType === "vendor") {
    vendorId = userId;
  } else {
    return fail(res, 422, `Only vendors are allowed to add media not ${userType}`);
  }

  // Validate request
  if (!data.name) return fail(res, 422, "name cannot be empty and must be alphanumeric.");
  if (!data.description) return fail(res, 422, "description cannot be empty and must be alphanumeric.");

  const newObject = {};
  newObject.vendor = vendorId;
  if (data.name) newObject.name = data.name;
  if (data.description) newObject.description = data.description;

  // Find brand and update it with the request body
  return Brand.findByIdAndUpdate(recordId, newObject, { new: true })
    .then((result) => {
      if (!result) return notFound(res, `Error: newly submitted record not found with id ${recordId}`);
      return success(res, 200, result, "New record has been created successfully!");
    })
    .catch(err => fail(res, 500, `Error updating record with id ${recordId}.\r\n${err.message}`));
}

// Delete a brand with the specified brandId in the request
export async function destroy(req, res) {
  const recordId = req.params.brandId || "";
  if (!recordId) return fail(res, 400, "No record Id as request parameter");
  if (!ObjectId.isValid(recordId)) return fail(res, 422, "Invalid record Id as request parameter");
  return Brand.findByIdAndRemove(recordId)
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
