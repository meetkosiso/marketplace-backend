/*
*/
import Blog, { ObjectId } from "./model";
import { success, fail, notFound } from "./../../services/response";
import { findVendorByDomain, findVendorById } from "./../vendor/controller";


// Find searched Blog
export function searchBlog(quest) {
  return new Promise((resolve, reject) => Blog.search(
    { query_string: { query: quest } },
    (err, results) => {
      if (!err) resolve(results);
      reject(err);
    },
  ));
}

// Find searched Blog
export async function search(req, res) {
  const quest = req.query.q || "";
  if (!quest) return fail(res, 422, `Why incorrect query string ${quest}?`);
  const results = await searchBlog(quest);
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
  return Blog.find()
    .populate({
      path: "review",
      select: "id subjectId comment rating customer",
      match: { standing: "active" },
      populate: {
        path: "customer",
      },
    })
    .populate({ path: "vendor", select: "id url businessName domainName", match: { standing: "active" } })
    .then(result => success(res, 200, result, "retrieving record(s) was successfully!"))
    .catch(err => fail(res, 500, `Error retrieving record(s).\r\n${err.message}`));
}

// Get all categories of a single vendor
export async function findVendorBlogs(req, res) {
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

  return Blog.find({ vendor: vendorId })
    .populate({
      path: "review",
      select: "id subjectId comment rating customer",
      match: { standing: "active" },
      populate: {
        path: "customer",
      },
    })
    .populate({ path: "vendor", select: "id url businessName domainName", match: { standing: "active" } })
    .then(result => success(res, 200, result, "retrieving record(s) was successfully!"))
    .catch(err => fail(res, 500, `Error retrieving record(s).\r\n${err.message}`));
}

// Retrieve a single record with a given recordId
export function findOne(req, res) {
  const recordId = req.params.blogId || "";
  if (!recordId) return fail(res, 400, "No record Id as request parameter");
  if (!ObjectId.isValid(recordId)) return fail(res, 422, "Invalid record Id as request parameter");
  return Blog.findById(recordId)
    .populate({
      path: "review",
      select: "id subjectId comment rating customer createdAt",
      match: { standing: "active" },
      populate: {
        path: "customer",
        select: "id username fullname email",
      },
    })
    .populate({ path: "vendor", select: "id url businessName domainName", match: { standing: "active" } })
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
  let vendorId;

  if (userType === "vendor") {
    vendorId = userId;
  } else {
    return fail(res, 422, `Only vendors are allowed to add media not ${userType}`);
  }

  // Validate request
  if (!data.kind) return fail(res, 422, "kind cannot be empty and must be alphanumeric.");
  if (!data.title) return fail(res, 422, "title cannot be empty and must be alphanumeric");
  if (!data.summary) return fail(res, 422, "summary cannot be empty and must be alphanumeric");
  if (!data.content) return fail(res, 422, "content cannot be empty and must be alphanumeric");
  if (!data.tag) return fail(res, 422, "tag cannot be empty and must be alphanumeric");

  const newObject = {};
  newObject.vendor = vendorId;
  if (data.kind) newObject.kind = data.kind;
  if (data.title) newObject.title = data.title;
  if (data.summary) newObject.summary = data.summary;
  if (data.content) newObject.content = data.content;
  if (data.tag) newObject.tag = data.tag;

  // Create a record
  const record = new Blog(newObject);

  // Save Product in the database
  return record.save()
    .then((result) => {
      if (!result) return notFound(res, "Error: newly submitted record not found");
      result.on("es-indexed", (err) => {
        if (err) console.log(`Error indexing record ${err.message}`);
        console.log("New blog index has been created successfully!");
      });
      return success(res, 200, result, "New record has been created successfully!");
    })
    .catch(err => fail(res, 500, `Error creating record.\r\n${err.message}`));
}


// Update a blog identified by the blogId in the request
export function update(req, res) {
  const recordId = req.params.blogId || "";
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
  if (!data.kind) return fail(res, 422, "kind cannot be empty and must be alphanumeric.");
  if (!data.title) return fail(res, 422, "title cannot be empty and must be alphanumeric");
  if (!data.summary) return fail(res, 422, "summary cannot be empty and must be alphanumeric");
  if (!data.content) return fail(res, 422, "content cannot be empty and must be alphanumeric");
  if (!data.tag) return fail(res, 422, "tag cannot be empty and must be alphanumeric");

  const newObject = {};
  newObject.vendor = vendorId;
  if (data.kind) newObject.kind = data.kind;
  if (data.title) newObject.title = data.title;
  if (data.summary) newObject.summary = data.summary;
  if (data.content) newObject.content = data.content;
  if (data.tag) newObject.tag = data.tag;

  // Find blog and update it with the request body
  return Blog.findByIdAndUpdate(recordId, { ...newObject }, { new: true })
    .then((result) => {
      if (!result) return notFound(res, `Error: newly submitted record not found with id ${recordId}`);
      return success(res, 200, result, "New record has been created successfully!");
    })
    .catch(err => fail(res, 500, `Error updating record with id ${recordId}.\r\n${err.message}`));
}


// Patch a blog identified by the blogId in the request
export function modify(req, res) {
  const recordId = req.params.blogId || "";
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
  if (!data.kind) return fail(res, 422, "kind cannot be empty and must be alphanumeric.");
  if (!data.title) return fail(res, 422, "title cannot be empty and must be alphanumeric");
  if (!data.summary) return fail(res, 422, "summary cannot be empty and must be alphanumeric");
  if (!data.content) return fail(res, 422, "content cannot be empty and must be alphanumeric");
  if (!data.tag) return fail(res, 422, "tag cannot be empty and must be alphanumeric");

  const newObject = {};
  newObject.vendor = vendorId;
  if (data.kind) newObject.kind = data.kind;
  if (data.title) newObject.title = data.title;
  if (data.summary) newObject.summary = data.summary;
  if (data.content) newObject.content = data.content;
  if (data.tag) newObject.tag = data.tag;

  // Find blog and update it with the request body
  return Blog.findByIdAndUpdate(recordId, newObject, { new: true })
    .then((result) => {
      if (!result) return notFound(res, `Error: newly submitted record not found with id ${recordId}`);
      return success(res, 200, result, "New record has been created successfully!");
    })
    .catch(err => fail(res, 500, `Error updating record with id ${recordId}.\r\n${err.message}`));
}


// Delete a blog with the specified blogId in the request
export async function destroy(req, res) {
  const recordId = req.params.blogId || "";
  if (!recordId) return fail(res, 400, "No record Id as request parameter");
  if (!ObjectId.isValid(recordId)) return fail(res, 422, "Invalid record Id as request parameter");
  return Blog.findByIdAndRemove(recordId)
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
