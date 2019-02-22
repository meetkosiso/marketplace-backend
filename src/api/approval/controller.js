/*
*/
import Approval, { ObjectId } from "./model";
import Product from "./../product/model";
import { findAndUpdateProduct } from "./../product/controller";
import { success, fail, notFound } from "./../../services/response";
import { hasProp } from "../../services/helpers";
import { findSetting } from "./../setting/controller";


/**
 * @description countApproval counts the exact number of products
 * @param {String} id product id of the product to be counted
 * @param {Object} condition filter query for products to be counted
 * @returns {Promise} count ot products.
 */
export function countApproval(condition = {}) {
  return new Promise((resolve, reject) => Approval
    .countDocuments(condition)
    .exec((err, result) => {
      if (!err) resolve(result);
      reject(err);
    }));
}


// Retrieve and return all records from the database.
export function findAll(req, res) {
  return Approval.find()
    .populate({ path: "product", select: "id name brand", match: { standing: "active" } })
    .populate({ path: "reviewer", select: "id businessName domainName", match: { standing: "active" } })
    .populate({ path: "vendor", select: "id businessName domainName", match: { standing: "active" } })
    .then(result => success(res, 200, result, "retrieving record(s) was successfully!"))
    .catch(err => fail(res, 500, `Error retrieving record(s). ${err.message}`));
}


// Retrieve a single record with a given recordId
export function findOne(req, res) {
  const recordId = req.params.approvalId || "";
  if (!recordId) return fail(res, 400, "No record Id as request parameter");
  if (!ObjectId.isValid(recordId)) return fail(res, 422, "Invalid record Id as request parameter");
  return Approval.findById(recordId)
    .populate({ path: "product", select: "id name brand", match: { standing: "active" } })
    .populate({ path: "reviewer", select: "id businessName domainName", match: { standing: "active" } })
    .populate({ path: "vendor", select: "id businessName domainName", match: { standing: "active" } })
    .then((result) => {
      if (!result) return notFound(res, "Error record not found.");
      return success(res, 200, result, "retrieving record was successfully!");
    })
    .catch(err => fail(res, 500, `Error retrieving record(s). ${err.message}`));
}


// Retrieve all aprovals for a vendor's products given vendorId
export function findByVendor(req, res) {
  const { userId } = res.locals;
  const recordId = req.params.vendorId || userId;
  if (!recordId) return fail(res, 400, "No record Id as request parameter");
  if (!ObjectId.isValid(recordId)) return fail(res, 422, "Invalid record Id as request parameter");
  return Approval.find({ vendor: recordId })
    .populate({ path: "product", match: { standing: "active" } })
    .populate({ path: "reviewer", select: "id businessName domainName", match: { standing: "active" } })
    .populate({ path: "vendor", select: "id businessName domainName", match: { standing: "active" } })
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


// Retrieve all aprovals by a vendor given reviewerId
export function findByReviewer(req, res) {
  const { userId } = res.locals;
  const recordId = req.params.reviewerId || userId;
  if (!recordId) return fail(res, 400, "No record Id as request parameter");
  if (!ObjectId.isValid(recordId)) return fail(res, 422, "Invalid record Id as request parameter");
  return Approval.find({ reviewer: recordId })
    .populate({ path: "product", select: "id name brand", match: { standing: "active" } })
    .populate({ path: "reviewer", select: "id businessName domainName", match: { standing: "active" } })
    .populate({ path: "vendor", select: "id businessName domainName", match: { standing: "active" } })
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

// Retrieve all aprovals for a product given productId
export function findByProduct(req, res) {
  const recordId = req.params.productId || "";
  if (!recordId) return fail(res, 400, "No record Id as request parameter");
  if (!ObjectId.isValid(recordId)) return fail(res, 422, "Invalid record Id as request parameter");
  return Approval.find({ product: recordId })
    .populate({ path: "product", select: "id name brand", match: { standing: "active" } })
    .populate({ path: "reviewer", select: "id businessName domainName", match: { standing: "active" } })
    .populate({ path: "vendor", select: "id businessName domainName", match: { standing: "active" } })
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
export async function create(req, res) {
  const data = req.body || {};
  const { userId, userType } = res.locals;
  if (userType === "vendor") {
    // vendorId = userId;
  } else {
    // return fail(res, 422, `Only vendors are allowed to create approvals not ${userType}`);
  }

  // Validate request
  // if (!data.reviewer)
  // return fail(res, 422, "reviewer cannot be empty and must be alphanumeric.");
  if (!data.product) return fail(res, 422, "product cannot be empty and must be alphanumeric");
  if (!data.vendor) return fail(res, 422, "vendor cannot be empty and must be alphanumeric");
  if (!hasProp(data, "approved")) return fail(res, 422, "approved cannot be empty and must be boolean");
  if (data.approved === "reajected") {
    if (!data.comment) return fail(res, 422, "comment cannot be empty and must be text");
  }

  const newObject = {};
  const productId = data.product;
  newObject.reviewer = userId;
  // newObject.reviewer = data.reviewer; // remove
  newObject.product = productId;
  newObject.vendor = data.vendor;
  newObject.comment = data.comment;
  newObject.approved = data.approved;

  // Create a record
  const record = new Approval(newObject);
  let numberAccepted = 0;
  let acceptanceLevel = 100;

  try {
    const filter = { product: productId, approved: "accepted", standing: "active" };
    numberAccepted = await countApproval(filter);
    const setting = await findSetting("PRODUCT_ACCEPTANCE");
    acceptanceLevel = parseInt(setting.value); // eslint-disable-line
  } catch (err) {
    return fail(res, 500, `Error getting approval settings. ${err.message}`);
  }

  if (numberAccepted >= acceptanceLevel) {
    return Product.findByIdAndUpdate(productId, { approved: "accepted" }, { new: true })
      .then((result) => {
        if (!result) return notFound(res, `Error: newly submitted record not found with id ${productId}`);
        return success(res, 200, [], `'${result.name}' status is currently ${result.approved}`);
      })
      .catch(err => fail(res, 500, `Error updating product approval status. ${productId}. ${err.message}`));
  }

  // Save Product in the database
  return record.save()
    .then((result) => {
      if (!result) return notFound(res, "Error: newly submitted record not found");
      return success(res, 200, result, "New record has been created successfully!");
    })
    .catch(err => fail(res, 500, `Error creating record. ${err.message}`));
}


// Update a approval identified by the approvalId in the request
export function update(req, res) {
  const recordId = req.params.approvalId || "";
  if (!recordId) return fail(res, 400, "No record Id as request parameter");
  if (!ObjectId.isValid(recordId)) return fail(res, 422, "Invalid record Id as request parameter");
  const data = req.body || {};
  const { userId, userType } = res.locals;

  if (userType === "vendor") {
    //
  } else {
    return fail(res, 422, `Only vendors are allowed to add media not ${userType}`);
  }

  // Validate request
  // if (!data.reviewer)
  // return fail(res, 422, "reviewer cannot be empty and must be alphanumeric.");
  if (!data.product) return fail(res, 422, "product cannot be empty and must be alphanumeric");
  if (!data.vendor) return fail(res, 422, "vendor cannot be empty and must be alphanumeric");
  if (!data.comment) return fail(res, 422, "comment cannot be empty and must be text");
  if (hasProp(data, "approved")) return fail(res, 422, "approved cannot be empty and must be boolean");

  const newObject = {};
  newObject.reviewer = userId;
  newObject.reviewer = data.reviewer;
  newObject.product = data.product;
  newObject.vendor = data.vendor;
  newObject.comment = data.comment;
  newObject.approved = data.approved;

  // Find approval and update it with the request body
  return Approval.findByIdAndUpdate(recordId, newObject, { new: true })
    .then((result) => {
      if (!result) return notFound(res, `Error: newly submitted record not found with id ${recordId}`);
      return success(res, 200, result, "New record has been created successfully!");
    })
    .catch(err => fail(res, 500, `Error updating record with id ${recordId}.\r\n${err.message}`));
}


// Patch a approval identified by the approvalId in the request
export function modify(req, res) {
  const recordId = req.params.approvalId || "";
  if (!recordId) return fail(res, 400, "No record Id as request parameter");
  if (!ObjectId.isValid(recordId)) return fail(res, 422, "Invalid record Id as request parameter");
  const data = req.body || {};
  const { userId, userType } = res.locals;

  if (userType === "vendor") {
    //
  } else {
    return fail(res, 422, `Only vendors are allowed to add media not ${userType}`);
  }

  // Validate request
  // if (!data.reviewer)
  // return fail(res, 422, "reviewer cannot be empty and must be alphanumeric.");
  if (!data.product) return fail(res, 422, "product cannot be empty and must be alphanumeric");
  if (!data.vendor) return fail(res, 422, "vendor cannot be empty and must be alphanumeric");
  if (!data.comment) return fail(res, 422, "comment cannot be empty and must be text");
  if (hasProp(data, "approved")) return fail(res, 422, "approved cannot be empty and must be boolean");

  const newObject = {};
  newObject.reviewer = userId;
  newObject.reviewer = data.reviewer;
  newObject.product = data.product;
  newObject.vendor = data.vendor;
  newObject.comment = data.comment;
  newObject.approved = data.approved;

  // Find approval and update it with the request body
  return Approval.findByIdAndUpdate(recordId, newObject, { new: true })
    .then((result) => {
      if (!result) return notFound(res, `Error: newly submitted record not found with id ${recordId}`);
      return success(res, 200, result, "New record has been created successfully!");
    })
    .catch(err => fail(res, 500, `Error updating record with id ${recordId}.\r\n${err.message}`));
}


// Delete a approval with the specified approvalId in the request
export async function destroy(req, res) {
  const recordId = req.params.approvalId || "";
  if (!recordId) return fail(res, 400, "No record Id as request parameter");
  if (!ObjectId.isValid(recordId)) return fail(res, 422, "Invalid record Id as request parameter");
  return Approval.findByIdAndRemove(recordId)
    .then((record) => {
      if (!record) return notFound(res, `Record not found with id ${recordId}`);
      return success(res, 200, [], "Record deleted successfully!");
    })
    .catch(err => fail(res, 500, `Error destroying record(s). ${err.message}`));
}
