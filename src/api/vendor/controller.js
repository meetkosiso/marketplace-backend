import Vendor, { ObjectId } from "./model";
import { success, fail, notFound } from "../../services/response/index";
import { getProperty, getContractAddress, propertyExist } from "../../services/helpers";
import { findProductByVendor } from "../product/controller";
import { findReviewByVendor } from "../review/controller";

// Find searched Vendor
export function searchVendor(quest) {
  return new Promise((resolve, reject) => Vendor.search(
    { query_string: { query: quest } },
    (err, results) => {
      if (!err) resolve(results);
      reject(err);
    },
  ));
}

// Find searched Vendor
export async function search(req, res) {
  const quest = req.query.q || "";
  if (!quest) return fail(res, 422, `Why incorrect query string ${quest}?`);
  const results = await searchVendor(quest);
  const records = results.hits.hits;
  const counts = parseInt(results.hits.total, 10);
  if (!(counts > 0)) return notFound(res, `${counts} record found!`);
  // Substitute vendor id with vendor object
  return Promise.all(results.hits.hits.map(async (record) => {
    record._source.reviewDetails = await findReviewByVendor(record._source.vendor); // eslint-disable-line
  })).then(() => success(res, 200, records, `retrieved ${counts} record(s) successfully!`));
}


// Retrieve and return all records from the database.
export function findAll(req, res) {
  return Vendor.find()
    .populate({ path: "review", select: "id subjectId comment rating", match: { standing: "active" } })
    .populate({ path: "products", match: { standing: "active" } })
    .populate({ path: "currency", select: "id name code kind exchange symbol icon", match: { standing: "active" } })
    .populate({ path: "language", select: "id name dbField icon", match: { standing: "active" } })
    .populate({ path: "templateHome.layout" })
    .populate({ path: "templateProduct.layout" })
    .populate({ path: "templateProductDetail.layout" })
    .populate({ path: "templateProfile.layout" })
    .populate({ path: "templateBlog.layout" })
    .populate({ path: "templateMail.layout" })
    .populate({ path: "templateInvoice.layout" })
    .populate({ path: "templateTicket.layout" })
    .populate({ path: "templateChat.layout" })
    .then(result => success(res, 200, result, "retrieving record(s) was successfully!"))
    .catch(err => fail(res, 500, `Error retrieving record(s).\r\n${err.message}`));
}

// Retrieve a single record with a given recordId
export function findOne(req, res) {
  let recordId;
  const { userId, userType, userRole } = res.locals;
  if (!userId || !userType || !userRole) return fail(res, 400, "Invalid authentication credentials");
  if (userType === "admin" || userType === "vendor") {
    //
  } else {
    return fail(res, 422, `Only Admins are allowed to retrieve this record not ${userType}`);
  }
  if (userType === "admin") recordId = req.params.vendorId || "";
  if (userType === "vendor") recordId = userId || "";
  if (!recordId) return fail(res, 400, "No record Id as request parameter");
  if (!ObjectId.isValid(recordId)) return fail(res, 422, "Invalid record Id as request parameter");
  return Vendor.findById(recordId)
    .populate({ path: "review", select: "id subjectId comment rating", match: { standing: "active" } })
    .populate({ path: "products", match: { standing: "active" } })
    .populate({ path: "currency", select: "id name code kind exchange symbol icon", match: { standing: "active" } })
    .populate({ path: "language", select: "id name dbField icon", match: { standing: "active" } })
    .populate({ path: "templateHome.layout", select: "id name page style placeholders", match: { standing: "active" } })
    .populate({ path: "templateProduct.layout", select: "id name page style placeholders", match: { standing: "active" } })
    .populate({ path: "templateProductDetail.layout", select: "id name page style placeholders", match: { standing: "active" } })
    .populate({ path: "templateProfile.layout", select: "id name page style placeholders", match: { standing: "active" } })
    .populate({ path: "templateBlog.layout", select: "id name page style placeholders", match: { standing: "active" } })
    .populate({ path: "templateMail.layout", select: "id name page style placeholders", match: { standing: "active" } })
    .populate({ path: "templateInvoice.layout", select: "id name page style placeholders", match: { standing: "active" } })
    .populate({ path: "templateTicket.layout", select: "id name page style placeholders", match: { standing: "active" } })
    .populate({ path: "templateChat.layout", select: "id name page style placeholders", match: { standing: "active" } })
    .then((result) => {
      if (!result) return notFound(res, `Error: record not found with id ${recordId}.`);
      console.log(result);
      return success(res, 200, result, `retrieving record was successfully with id ${recordId}.`);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        notFound(res, `Error retrieving record with id ${recordId}.\r\n${err.message}`);
      }
      return fail(res, 500, `Error retrieving record with id ${recordId}.\r\n${err.message}`);
    });
}

/**
 * @description findOneDomain
 * @param {Object} req http request object
 * @param {Object} res http request object returns
 * @requires {String} domainName as req parametr
 */
// Retrieve a single record with a given domainName
export function findOneDomain(req, res) {
  const domainName = req.params.domainName || "";
  if (!domainName) return fail(res, 400, "No record domain as request parameter");
  return Vendor
    .findOne({ domainName })
    .populate({ path: "review", select: "id subjectId comment rating", match: { standing: "active" } })
    .populate({ path: "products", match: { standing: "active" } })
    .populate({ path: "currency", select: "id name code kind exchange symbol icon", match: { standing: "active" } })
    .populate({ path: "language", select: "id name dbField icon", match: { standing: "active" } })
    .populate({ path: "templateHome.layout", select: "id name page style placeholders", match: { standing: "active" } })
    .populate({ path: "templateProduct.layout", select: "id name page style placeholders", match: { standing: "active" } })
    .populate({ path: "templateProductDetail.layout", select: "id name page style placeholders", match: { standing: "active" } })
    .populate({ path: "templateProfile.layout", select: "id name page style placeholders", match: { standing: "active" } })
    .populate({ path: "templateBlog.layout", select: "id name page style placeholders", match: { standing: "active" } })
    .populate({ path: "templateMail.layout", select: "id name page style placeholders", match: { standing: "active" } })
    .populate({ path: "templateInvoice.layout", select: "id name page style placeholders", match: { standing: "active" } })
    .populate({ path: "templateTicket.layout", select: "id name page style placeholders", match: { standing: "active" } })
    .populate({ path: "templateChat.layout", select: "id name page style placeholders", match: { standing: "active" } })
    .then((result) => {
      if (!result) return notFound(res, `Error: record not found with domain ${domainName}.`);
      return success(res, 200, result, `retrieving record was successfully with domain ${domainName}.`);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        notFound(res, `Error retrieving record with domain ${domainName}.\r\n${err.message}`);
      }
      return fail(res, 500, `Error retrieving record with domain ${domainName}.\r\n${err.message}`);
    });
}

/**
 * @description findVendorById find a particular vendor by id
 * @param {String} vendorId vendor id
 * @returns {Promise} vendor object promise
 */
export function findVendorById(vendorId) {
  return Vendor
    .findById(vendorId)
    .populate({ path: "review", select: "id subjectId comment rating", match: { standing: "active" } })
    .populate({ path: "products", match: { standing: "active" } })
    .populate({ path: "currency", select: "id name code kind exchange symbol icon", match: { standing: "active" } })
    .populate({ path: "language", select: "id name dbField icon", match: { standing: "active" } })
    .populate({ path: "templateHome.layout", select: "id name page style placeholders", match: { standing: "active" } })
    .populate({ path: "templateProduct.layout", select: "id name page style placeholders", match: { standing: "active" } })
    .populate({ path: "templateProductDetail.layout", select: "id name page style placeholders", match: { standing: "active" } })
    .populate({ path: "templateProfile.layout", select: "id name page style placeholders", match: { standing: "active" } })
    .populate({ path: "templateBlog.layout", select: "id name page style placeholders", match: { standing: "active" } })
    .populate({ path: "templateMail.layout", select: "id name page style placeholders", match: { standing: "active" } })
    .populate({ path: "templateInvoice.layout", select: "id name page style placeholders", match: { standing: "active" } })
    .populate({ path: "templateTicket.layout", select: "id name page style placeholders", match: { standing: "active" } })
    .populate({ path: "templateChat.layout", select: "id name page style placeholders", match: { standing: "active" } })
    .then((vendor) => {
      if (!vendor) return {};
      return vendor;
    })
    .catch((err) => { throw err; });
}

// Find a single vendor with a domainName
export function findVendorByDomain(domainName) {
  return Vendor
    .findOne({ domainName })
    .populate({ path: "review", select: "id subjectId comment rating", match: { standing: "active" } })
    .populate({ path: "products", match: { standing: "active" } })
    .populate({ path: "currency", select: "id name code kind exchange symbol icon", match: { standing: "active" } })
    .populate({ path: "language", select: "id name dbField icon", match: { standing: "active" } })
    .then((vendor) => {
      if (!vendor) return false;
      return vendor;
    })
    .catch((err) => { throw err; });
}

// Retrieve a single record with a given recordId
export function findVerify(req, res) {
  const attribute = req.params.attribute || "";
  const value = req.params.value || "";
  if (!attribute || !value) return fail(res, 400, "Error: Incorrect request parameter");
  return Vendor.count({ attribute: value })
    .then((result) => {
      console.log(`\r\n Result count: ${result}`);
      if (!result && result !== 0) return notFound(res, `Error: record not found with attribute ${attribute}.`);
      if (result > 0) return success(res, 200, { exists: true }, `${attribute} record with value ${value} exists.`);
      return success(res, 200, { exists: false }, `No ${attribute} record with value ${value} exists.`);
    }).catch((err) => {
      if (err.kind === "ObjectId") {
        notFound(res, `Error counting record with attribute ${attribute}.\r\n${err.message}`);
      }
      return fail(res, 500, `Error counting record with attribute ${attribute}.\r\n${err.message}`);
    });
}


// Update record identified by the Id in the request
export function update(req, res) {
  const data = req.body || {};
  const { userId, userType, userRole } = res.locals;
  if (!userId || !userType || !userRole) return fail(res, 400, "Invalid authentication credentials");

  let vendorId;

  if (userType === "vendor") {
    vendorId = userId;
  } else {
    return fail(res, 422, `Only Customers are allowed to update this record not ${userType}`);
  }
  // Validate request
  if (!data.email) return fail(res, 422, "email cannot be empty");

  const newObject = {};
  if (data.fullname) newObject.fullname = data.fullname;
  if (data.phone) newObject.phone = data.phone;
  if (data.email) newObject.email = data.email;
  if (data.password) newObject.password = data.password;
  if (data.username) newObject.username = data.username;
  if (data.gender) newObject.gender = data.gender;
  if (data.wallet) newObject.wallet = data.wallet;
  if (data.businessName) newObject.businessName = data.businessName;
  if (data.domainName) newObject.domainName = data.domainName;
  if (data.recoveryCode) newObject.recoveryCode = data.recoveryCode;

  if (data.wishlist && typeof data.wishlist === "object" && data.wishlist[0].names &&
  data.wishlist[0].carts && typeof (data.wishlist[0].carts) === "object") {
    let fieldName = "";
    let fieldCart = {};
    const fieldArray = [];
    data.wishlist.forEach((item, index, array) => {
      if (typeof item === "object" && item.name && item.cart) {
        fieldName = data.wishlist[index].name;
        fieldCart = data.wishlist[index].cart;
        fieldArray.push({ names: fieldName, carts: fieldCart });
      }
    });
    newObject.wishlist = {};
    newObject.wishlist = fieldArray;
  }

  if (data.cart && typeof data.cart === "object" && data.cart[0].product && data.cart[0].quantity) {
    let fieldProduct;
    let fieldQuantity;
    const fieldArray = [];
    data.cart.forEach((item, index, array) => {
      if (typeof item === "object" && item.product && item.quantity) {
        fieldProduct = data.cart[index].product;
        fieldQuantity = data.cart[index].quantity;
        fieldArray.push({ product: fieldProduct, quantity: fieldQuantity });
      }
    });
    newObject.cart = {};
    newObject.cart = fieldArray;
  }

  if (typeof data.completeProfile === "boolean") {
    newObject.completeProfile = data.completeProfile;
  }
  if (typeof data.emailVerified === "boolean") {
    newObject.emailVerified = data.emailVerified;
  }
  if (typeof data.domainNameSet === "boolean") {
    newObject.domainNameSet = data.domainNameSet;
  }
  if (typeof data.businessVerified === "boolean") {
    newObject.businessVerified = data.businessVerified;
  }


  if (data.preferences) {
    newObject.preferences = {};
    if (data.preferences.currency) newObject.preferences.currency = data.preferences.currency;
    if (data.preferences.language) newObject.preferences.language = data.preferences.language;
  }

  if (data.address) {
    newObject.address = {};
    if (data.address.country) newObject.address.country = data.address.country;
    if (data.address.state) newObject.address.state = data.address.state;
    if (data.address.city) newObject.address.city = data.address.city;
    if (data.address.street) newObject.address.street = data.address.street;
    if (data.address.building) newObject.address.building = data.address.building;
    if (data.address.zip) newObject.address.zip = data.address.zip;
  }

  if (propertyExist(data, "googleAnalytics", "trackingId")) {
    newObject.googleAnalytics = {};
    newObject.googleAnalytics.trackingId = data.googleAnalytics.trackingId;
  }

  if (propertyExist(data, "frontend") && data.frontend) {
    newObject.frontend = {};
    if (propertyExist(data, "frontend", "logo") && data.frontend.logo) newObject.frontend.logo = data.frontend.logo;
    if (propertyExist(data, "frontend", "banner") && data.frontend.banner) newObject.frontend.banner = data.frontend.banner;
    if (propertyExist(data, "frontend", "slogan") && data.frontend.slogan) newObject.frontend.slogan = data.frontend.slogan;
    if (propertyExist(data, "frontend", "description") && data.frontend.description) newObject.frontend.description = data.frontend.description;
    if (propertyExist(data, "frontend", "tag") && data.frontend.tag) newObject.frontend.tag = data.frontend.tag;
    if (propertyExist(data, "frontend", "theme") && data.frontend.theme) newObject.frontend.theme = data.frontend.theme;
  }

  // Find record and update it with id
  return Vendor.findByIdAndUpdate(vendorId, newObject, { new: true })
    .then((result) => {
      if (!result) return notFound(res, `Error: newly submitted record not found with id ${vendorId}`);
      return success(res, 200, result, "New record has been created successfully!");
    })
    .catch(err => fail(res, 500, `Error updating record with id ${vendorId}.\r\n${err.message}`));
}

// Patch record identified by the Id in the request
export async function modify(req, res) {
  const recordId = req.params.vendorId || "";
  const data = req.body || {};
  if (!recordId) return fail(res, 400, "No record Id as request parameter");
  if (!ObjectId.isValid(recordId)) return fail(res, 422, "Invalid record Id as request parameter");

  const { userId, userType, userRole } = res.locals;
  if (!userId || !userType || !userRole) return fail(res, 400, "Invalid authentication credentials");

  if (userType === "admin" && (userRole === "master" || userRole === "super")) {
    // we are cool!
  } else {
    return fail(res, 422, `Only Admin is allowed to update this record not ${userType} ${userRole}`);
  }

  const newObject = {};
  newObject.admin = userId;
  newObject.updated = Date.now();
  if (getProperty(data, "standing")) newObject.standing = data.standing;

  if (getProperty(data, "businessVerified")) {
    newObject.businessVerified = data.businessVerified;
  }
  if (getProperty(data, "comment")) {
    newObject.comment = data.comment;
  }

  if (["active", "inactive", "trashed"].includes(data.standing)) {
    newObject.standing = data.standing;
  } else {
    return fail(res, 422, `User status can only be "active", "inactive", or "trashed", not ${data.standing}`);
  }

  if (data.action && (userRole === "super" || userRole === "master") &&
   (["allow", "restrict", "deny"]).includes(data.action)) {
    newObject.action = data.action;
  } else {
    return fail(res, 422, `Only Master can take Administrative Action against a vendor not ${userRole}`);
  }

  // Find record and update it with id
  return Vendor.findByIdAndUpdate(recordId, newObject, { new: true })
    .then((result) => {
      if (!result) return notFound(res, `Error: newly submitted record not found with id ${recordId}`);
      return success(res, 200, result, "New record has been created successfully!");
    })
    .catch(err => fail(res, 500, `Error updating record with id ${recordId}.\r\n${err.message}`));
}


// Patch record identified by the Id in the request
export async function activate(req, res) {
  const data = req.body || {};
  console.log(data);
  // if (!data.paymentActivation)
  // return fail(res, 400, "Why no payment activation in body parameter");
  // if (typeof data.paymentActivation !== "boolean") {
  //   return fail(res, 400, `Why invalid payment activation in body parameter ${data.approval}`);
  // }
  const { userId, userType, userRole } = res.locals;
  if (!userId || !userType || !userRole) return fail(res, 400, "Invalid authentication credentials");

  if (userType !== "vendor") return fail(res, 422, "Only vendor is allowed to activate payment");

  const newObject = {};
  newObject.activationDate = Date.now();
  newObject.paymentActivation = true;

  const vendor = await findVendorById(userId);
  if (vendor.paymentActivation) {
    return fail(res, 422, "Activation can only be done once");
  }
  let ok = false;
  if (vendor.approval === "accepted") ok = true;

  if (!(ok && vendor.standing === "active")) {
    return fail(res, 422, `Only "Active" vendors can be granted approval not ${vendor.standing}.`);
  }
  if (!(ok && getProperty(vendor, "action") === "allow")) {
    return fail(res, 422, `Admin action needs to be "allowed" for this operation, not ${vendor.action}.`);
  }
  if (!(ok && getProperty(vendor, "businessVerified") === "true")) {
    return fail(res, 422, `Only verified businesses can be approved, not ${getProperty(vendor, "businessVerified")}.`);
  }
  if (!(ok && getProperty(vendor, "contractAddress"))) {
    return fail(res, 422, `Only allows vendors with valid contracts values, not ${getProperty(vendor, "contractAddress")}.`);
  }
  // Find record and update it with id
  return Vendor.findByIdAndUpdate(userId, newObject, { new: true })
    .then((result) => {
      if (!result) return notFound(res, `Error: newly submitted record not found with id ${userId}`);
      return success(res, 200, result, "New record has been approved successfully!");
    })
    .catch(err => fail(res, 500, `Error approving record with id ${userId}.\r\n${err.message}`));
}

// Patch record identified by the Id in the request
export async function deploy(req, res) {
  const data = req.body || {};
  if (!data.contractAddress) return fail(res, 400, "Why no payment activation in body parameter");
  if (data.contractAddress.length !== 42) return fail(res, 400, "The contract Address is invalid");
  const { userId, userType, userRole } = res.locals;
  if (!userId || !userType || !userRole) return fail(res, 400, "Invalid authentication credentials");

  if (userType !== "vendor") return fail(res, 422, "Only vendor is allowed to deploy contract address");

  const newObject = {};
  newObject.contractAddress = data.contractAddress;

  const vendor = await findVendorById(userId);
  // if (vendor.contractAddress) {
  //   return fail(res, 422, "Contract deployment can only be done once");
  // }

  if (!(getProperty(vendor, "action") === "allow")) {
    return fail(res, 422, `Admin action needs to be "allowed" for this operation, not ${vendor.action}.`);
  }
  if (!(getProperty(vendor, "businessVerified") === "true")) {
    return fail(res, 422, `Only verified businesses can be approved, not ${getProperty(vendor, "businessVerified")}.`);
  }
  // Find record and update it with id
  return Vendor.findByIdAndUpdate(userId, newObject, { new: true })
    .then((result) => {
      if (!result) return notFound(res, `Error: newly submitted record not found with id ${userId}`);
      return success(res, 200, result, "New record has been deployed successfully!");
    })
    .catch(err => fail(res, 500, `Error saving record with id ${userId}.\r\n${err.message}`));
}


// Patch record identified by the Id in the request
export async function approve(req, res) {
  const recordId = req.params.vendorId || "";
  const data = req.body || {};
  if (!recordId) return fail(res, 400, "No record Id as request parameter");
  if (!ObjectId.isValid(recordId)) return fail(res, 422, "Invalid record Id as request parameter");
  if (!data.approval) return fail(res, 400, "Why no account approval status body parameter");
  if (["pending", "accepted", "rejected"].includes(getProperty(data.approval))) {
    return fail(res, 400, `Why invalid account approval status body parameter ${data.approval}`);
  }
  const { userId, userType, userRole } = res.locals;
  if (!userId || !userType || !userRole) return fail(res, 400, "Invalid authentication credentials");

  if (userType === "admin" && (userRole === "master" || userRole === "super")) {
    // we are cool!
  } else {
    return fail(res, 422, `Only Admin is allowed to update this record not ${userType} ${userRole}`);
  }

  const newObject = {};
  newObject.updated = Date.now();
  newObject.approval = data.approval;
  newObject.approvedBy = userId;

  const vendor = await findVendorById(recordId);
  if (data.approval === "rejected") {
    if (!data.comment) return fail(res, 422, "State the reseaon for rejecting Vendor Account");
    if (!((data.comment).length > 20)) return fail(res, 422, "Comment is too short.");
    newObject.comment = data.comment;
  }

  let ok = false;
  if (data.approval === "accepted") ok = true;

  if (!(ok && vendor.standing === "active")) {
    return fail(res, 422, `Only "Active" vendors can be granted approval not ${vendor.standing}.`);
  }
  if (!(ok && getProperty(vendor, "action") === "allow")) {
    return fail(res, 422, `Admin action needs to be "allowed" for this operation, not ${vendor.action}.`);
  }
  if (!(ok && getProperty(vendor, "businessVerified") === "true")) {
    return fail(res, 422, `Only verified businesses can be approved, not ${getProperty(vendor, "businessVerified")}.`);
  }
  // Find record and update it with id
  return Vendor.findByIdAndUpdate(recordId, newObject, { new: true })
    .then((result) => {
      if (!result) return notFound(res, `Error: newly submitted record not found with id ${recordId}`);
      return success(res, 200, result, "New record has been approved successfully!");
    })
    .catch(err => fail(res, 500, `Error approving record with id ${recordId}.\r\n${err.message}`));
}


// Delete a vendor with the specified vendorId in the request
export async function destroy(req, res) {
  const recordId = req.params.vendorId || "";
  const { userId, userType, userRole } = res.locals;
  if (!recordId) return fail(res, 400, "No record Id as request parameter");
  if (!ObjectId.isValid(recordId)) return fail(res, 422, "Invalid record Id as request parameter");
  if (!userId || !userType || !userRole) return fail(res, 400, "Invalid authentication credentials");

  if (userType === "admin" && userRole === "super") {
    // we are cool!
  } else {
    return fail(res, 422, `Only Super Admin is allowed to delete record not ${userRole}`);
  }

  const product = await findProductByVendor(recordId);
  if (product) {
    return fail(res, 422, "Operation not allowed. Vendor still has product(s).");
  }

  return Vendor.findByIdAndRemove(recordId)
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
