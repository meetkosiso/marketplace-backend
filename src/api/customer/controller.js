
import bcrypt from "bcrypt";
import Customer, { ObjectId } from "./model";
import { success, fail, notFound } from "./../../services/response";
import { propertyExist, saltRounds } from "./../../services/helpers";

// Retrieve and return all records from the database.
export function findAll(req, res) {
  return Customer.find()
    .then(result => success(res, 200, result, "retrieving record(s) was successfully!"))
    .catch(err => fail(res, 500, `Error retrieving record(s).\r\n${err.message}`));
}

// Find a single product with a given product id
export function findCustomerById(id) {
  return Customer
    .findById(id)
    .then((result) => {
      if (!result) return {};
      return result;
    })
    .catch((err) => { throw err; });
}

// Retrieve a single record with a given recordId
export function findOne(req, res) {
  let recordId;
  const { userId, userType, userRole } = res.locals;
  if (!userId || !userType || !userRole) return fail(res, 400, "Invalid authentication credentials");
  if (userType === "admin" || userType === "customer") {
    //
  } else {
    return fail(res, 422, `Only Admins are allowed to retrieve this record not ${userType}`);
  }
  if (userType === "admin") recordId = req.params.customerId || "";
  if (userType === "customer") recordId = userId || "";
  console.log(recordId);
  if (!recordId) return fail(res, 400, "No record Id as request parameter");
  if (!ObjectId.isValid(recordId)) return fail(res, 422, "Invalid record Id as request parameter");
  return Customer.findById(recordId)
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

// Retrieve a single record with a given recordId
export function findVerify(req, res) {
  const attribute = req.params.attribute || "";
  const value = req.params.value || "";
  if (!attribute || !value) return fail(res, 400, "Error: Incorrect request parameter");
  return Customer.count({ attribute: value })
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
  const { userId, userType } = res.locals;
  let customerId;

  if (userType === "customer") {
    customerId = userId;
  } else {
    return fail(res, 422, `Only Customers are allowed to update this record not ${userType}`);
  }

  // Validate request
  if (!data.username) return fail(res, 422, "username cannot be empty and must be alphanumeric.");
  if (!data.email) return fail(res, 422, "email cannot be empty");

  const newObject = {};
  newObject.customer = customerId;
  if (data.fullname) newObject.fullname = data.fullname;
  if (data.username) newObject.username = data.username;
  if (data.gender && ["male", "female"].includes(data.gender)) newObject.gender = data.gender;
  if (data.phone) newObject.phone = data.phone;
  if (data.email) newObject.email = data.email;
  if (data.password) newObject.password = data.password;
  if (data.recoveryCode) newObject.recoveryCode = data.recoveryCode;
  if (data.wallet) newObject.wallet = data.wallet;

  if (data.wishlist && typeof data.wishlist === "object" && data.wishlist.length > 0
    && data.wishlist[0].names && data.wishlist[0].carts
    && typeof (data.wishlist[0].carts) === "object") {
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

  if (data.cart && typeof data.cart === "object" && data.cart.length > 0
   && data.cart[0].product && data.cart[0].quantity) {
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

  if (propertyExist(data, "preferences", "currency") || propertyExist(data, "preferences", "language")) {
    newObject.preferences = {};
    if (data.preferences.currency) newObject.preferences.currency = data.preferences.currency;
    if (data.preferences.language) newObject.preferences.language = data.preferences.language;
  }

  if (propertyExist(data, "shipping", "zip") && propertyExist(data, "shipping", "city")
    && propertyExist(data, "shipping", "street")) {
    newObject.shipping = {};
    if (data.shipping.country) newObject.shipping.country = data.shipping.country;
    if (data.shipping.state) newObject.shipping.state = data.shipping.state;
    if (data.shipping.city) newObject.shipping.city = data.shipping.city;
    if (data.shipping.street) newObject.shipping.street = data.shipping.street;
    if (data.shipping.building) newObject.shipping.building = data.shipping.building;
    if (data.shipping.zip) newObject.shipping.zip = data.shipping.zip;
  }

  if (data.phone) newObject.phone = data.phone;
  if (data.email) newObject.email = data.email;

  // import notification function

  // Find record and update it with id
  return Customer.findByIdAndUpdate(customerId, newObject, { new: true })
    .then((result) => {
      if (!result) return notFound(res, `Error: newly submitted record not found with id ${customerId}`);
      return success(res, 200, result, "New record has been created successfully!");
    })
    .catch(err => fail(res, 500, `Error updating record with id ${customerId}.\r\n${err.message}`));
}


// Patch record identified by the Id in the request
export function modify(req, res) {
  const recordId = req.params.customerId || "";
  if (!recordId) return fail(res, 400, "No record Id as request parameter");
  if (!ObjectId.isValid(recordId)) return fail(res, 422, "Invalid record Id as request parameter");
  const data = req.body || {};
  const { userId, userType } = res.locals;
  let customerId;

  if (userType === "customer") {
    customerId = userId;
  } else {
    return fail(res, 422, `Only Customers are allowed to update this record not ${userType}`);
  }

  // Validate request
  if (!data.username) return fail(res, 422, "username cannot be empty and must be alphanumeric.");
  if (!data.email) return fail(res, 422, "email cannot be empty");

  const newObject = {};
  newObject.customer = customerId;
  if (data.fullname) newObject.fullname = data.fullname;
  if (data.username) newObject.username = data.username;
  if (data.gender && ["male", "female"].includes(data.gender)) newObject.gender = data.gender;
  if (data.phone) newObject.phone = data.phone;
  if (data.email) newObject.email = data.email;
  if (data.password) newObject.password = data.password;
  if (data.recoveryCode) newObject.recoveryCode = data.recoveryCode;
  if (data.wallet) newObject.wallet = data.wallet;

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

  if ((data.preferences.currency) || (data.preferences.language)) {
    newObject.preferences = {};
    if (data.preferences.currency) newObject.preferences.currency = data.preferences.currency;
    if (data.preferences.language) newObject.preferences.language = data.preferences.language;
  }

  if ((data.shipping.zip) && (data.shipping.city) && (data.shipping.street)) {
    newObject.shipping = {};
    if (data.shipping.country) newObject.shipping.country = data.shipping.country;
    if (data.shipping.state) newObject.shipping.state = data.shipping.state;
    if (data.shipping.city) newObject.shipping.city = data.shipping.city;
    if (data.shipping.street) newObject.shipping.street = data.shipping.street;
    if (data.shipping.building) newObject.shipping.building = data.shipping.building;
    if (data.shipping.zip) newObject.shipping.zip = data.shipping.zip;
  }

  if (data.phone) newObject.phone = data.phone;
  if (data.email) newObject.email = data.email;


  // Find record and update it with id
  return Customer.findByIdAndUpdate(recordId, { ...newObject }, { new: true })
    .then((result) => {
      if (!result) return notFound(res, `Error: newly submitted record not found with id ${recordId}`);
      return success(res, 200, result, "New record has been created successfully!");
    })
    .catch(err => fail(res, 500, `Error updating record with id ${recordId}.\r\n${err.message}`));
}

export async function passwordUpdate(req, res) {
  const { userId, userType } = res.locals;
  const data = req.body || {};
  if (!data.password) return fail(res, 500, "password must not be empty and must be alphanumeric");
  if (!data.confirm_password) return fail(res, 500, "confirm_password must not be empty and must be alphanumeric");
  if (data.password !== data.confirm_password) return fail(res, 500, "password and confirm_password do not match");
  return bcrypt.hash(data.password, saltRounds)
    .then((hash) => {
      Customer.findByIdAndUpdate(userId, {
        password: hash,
        notifications: { date: Date.now(), notice: "Please update your profile", standing: "unread" },
      }, { new: true })
        .then(saved => success(res, 200, saved, "new User record has been created"))
        .catch(err => fail(res, 500, `Error saving user password. ${err}`));
    })
    .catch(err => fail(res, 500, `Error encrypting user password. ${err}`));
}

// Delete a customer with the specified customerId in the request
export async function destroy(req, res) {
  const recordId = req.params.customerId || "";
  if (!recordId) return fail(res, 400, "No record Id as request parameter");
  if (!ObjectId.isValid(recordId)) return fail(res, 422, "Invalid record Id as request parameter");
  return Customer.findByIdAndRemove(recordId)
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
