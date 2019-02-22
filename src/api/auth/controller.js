/**
* File /auth/controller.js
* @desc It handles User users Login and Signup
* @date 6 August 2018
* @params publicAddress for metamask
*/

import ethUtil from "ethereumjs-util";
import jwt from "jsonwebtoken";
import jwtDecode from "jwt-decode";
import bcrypt from "bcrypt";
import Admin from "./../admin/model";
import Vendor from "./../vendor/model";
import Customer from "./../customer/model";
import { getClientAccess, addToArrayOfObjects, randomNonce, findEmail, saltRounds } from "./../../services/helpers";
import { success, fail, notFound } from "./../../services/response";
import { jwtSecret, getToken } from "./../../services/jwt";
import { countAdmin } from "../admin/controller";


// ///////////////////////////////////////////////////
// 1. First, find the record with public Address
// /:userType/:authType/publicaddress/:publicAddress
// //////////////////////////////////////////////////
export async function find(req, res, next) {
  let User = null; let adminCount;
  const { userType, authType, publicAddress } = req.params;
  console.log(`User Type: ${userType} Auth Type: ${authType} publicAddress: ${publicAddress}`);
  if (!userType || !authType || !publicAddress) {
    return fail(res, 401, "Request should have a Metamask address or auth  and user type");
  }

  if (userType === "admin") {
    User = Admin;
    if (authType === "signup") {
      try {
        adminCount = await countAdmin({});
        // console.log("\r\n \r\n****counting admin", adminCount);
      } catch (err) {
        // console.log("Error: ", err.message);
      }
    }
  } else if (userType === "vendor") {
    User = Vendor;
  } else if (userType === "customer") {
    User = Customer;
  } else {
    return fail(res, 401, "Request should have a valid user type");
  }

  const newUser = new User({ publicAddress });

  return User.findOne({ publicAddress }).exec()
    .then((user) => {
      if ((!user && authType === "login") || (user && authType === "signup")) {
        const msg = authType === "login" ? ` ${userType} is not found, please signup` : ` ${userType} already exist, login`;
        return fail(res, 401, `User with publicAddress ${publicAddress} ${msg} `);
      }

      // /////////////////////////////////////////////////////////////
      // If the user doesn't exit and access is signup, Create a User
      // /////////////////////////////////////////////////////////////

      if (!user && authType === "signup") {
        if (userType === "admin" && adminCount === 0) {
          newUser.role = "super";
          newUser.standing = "active";
          newUser.completeProfile = true;
          newUser.notifications = { date: Date.now(), notice: "Please update your profile", standing: "unread" };
        }
        if (userType === "admin" && adminCount > 0) {
          newUser.notifications = { date: Date.now(), notice: "Please update your profile", standing: "unread" };
        }
        if (userType === "vendor") {
          newUser.domainName = publicAddress;
        }

        return newUser.save()
          .then(record => success(res, 200, { publicAddress, nonce: record.nonce, authType: "signup" }, "new User record has been created"))
          .catch(err => fail(res, 500, err.message || "Some error occurred while creating the User."));
      }

      // /////////////////////////////////////////////////////////////
      // If the user exist and access is login, authenticate a User
      // /////////////////////////////////////////////////////////////
      if ((user && authType === "login")) {
        return success(res, 200, { publicAddress, nonce: user.nonce, authType }, "Login successful!");
      }
      return fail(res, 500, "Unknown error finding user.");
    })
    .catch(next);
}

// ///////////////////////////////////////////////////
// 2. Secondly, the signed message is posted with publicAddress
// /{post} /:userType/auth/:authType Authenticate
// body { signature, publicAddress }
// returns the accessToken if Authentication is successful
// //////////////////////////////////////////////////
export function auth(req, res, next) {
  let User = null;
  const { signature, publicAddress } = req.body;
  const { userType, authType } = req.params;
  // console.log(`${signature}, ${publicAddress} ${userType}, ${authType}`);
  if (!signature || !publicAddress) {
    return fail(res, 401, "Request should have signature and publicAddress");
  }

  switch (userType) {
    case "admin": User = Admin;
      break;
    case "vendor": User = Vendor;
      break;
    case "customer": User = Customer;
      break;
    default: return fail(res, 401, "Unknown user type!");
  }

  return User.findOne({ publicAddress, action: "allow" }).exec()

  // //////////////////////////////////////////////////
  // Step 1: Get the user with the given publicAddress
  // //////////////////////////////////////////////////

    .then((user) => {
      if (!user) {
        return fail(res, 401, `User with publicAddress ${publicAddress} is not allowed access or not found in database.`);
      }
      const clientAccess = getClientAccess(req);
      // Log last_access
      user.lastAccess = addToArrayOfObjects(user.lastAccess, 10, clientAccess);
      return user.save()
        .then(record => record)
        .catch(err => fail(res, 401, err.message || "Unable to update user lastAccess."));
    })

  // //////////////////////////////////////////////////
  // Step 2: Verify digital signature
  // //////////////////////////////////////////////////

    .then((user) => {
      const msg = `I am signing my one-time nonce: ${user.nonce} to ${authType}`;

      // We now are in possession of msg, publicAddress and signature. We
      // can perform an elliptic curve signature verification with ecrecover
      const msgBuffer = ethUtil.toBuffer(msg);
      const msgHash = ethUtil.hashPersonalMessage(msgBuffer);
      const signatureBuffer = ethUtil.toBuffer(signature);
      const signatureParams = ethUtil.fromRpcSig(signatureBuffer);
      const publicKey = ethUtil.ecrecover(
        msgHash,
        signatureParams.v,
        signatureParams.r,
        signatureParams.s,
      );
      const addressBuffer = ethUtil.publicToAddress(publicKey);
      const address = ethUtil.bufferToHex(addressBuffer);

      // The signature verification is successful if the address found with
      // ecrecover matches the initial publicAddress
      if (address.toLowerCase() !== publicAddress.toLowerCase()) {
        return fail(res, 401, "Signature verification failed");
      }
      return user;
    })

  // //////////////////////////////////////////////////
  // Step 3: Generate a new nonce for the user
  // //////////////////////////////////////////////////

    .then((user) => {
      user.nonce = randomNonce();
      return user.save()
        .then(record => record)
        .catch(err => fail(res, 401, err.message || "\r\nUnable to update user nonce."));
    })

  // //////////////////////////////////////////////////
  // Step 4: Create JWT
  // //////////////////////////////////////////////////

    .then(user =>
      new Promise((resolve, reject) =>
      // https://github.com/auth0/node-jsonwebtoken
        jwt.sign(
          {
            payload: { id: user.id, publicAddress, email: user.email },
          },
          jwtSecret,
          null,
          (err, token) => {
            if (err) return reject(err);
            return resolve(token);
          },
        )))
    .then(accessToken => success(res, 200, { accessToken }, "Authentication successful!"))
    .catch(next);
}


// Authorize to access admin protected route
export function isValidAdmin(req, res, next) {
  const accessToken = getToken(req);
  let filter;

  if (!req.params) {
    return fail(res, 403, "Authentication Failed: invalid request parameters.");
  }

  if (!accessToken) {
    return fail(res, 403, "Authentication Failed: undefined token.");
  }

  const { payload: { id, publicAddress, email } } = jwtDecode(accessToken);
  if (publicAddress && email) {
    filter = { publicAddress, email };
  } else if (publicAddress) {
    filter = { publicAddress };
  } else if (email) {
    filter = { email };
  }
  return Admin.findOne(filter).exec()
  // Step 1: Get the admin with the given publicAddress
    .then((admin) => {
      if (!admin) {
        return notFound(res, `Admin with publicAddress ${publicAddress} or
      email ${email} is not found in database.`);
      }
      res.locals.userId = id;
      res.locals.userType = "admin";
      res.locals.userRole = admin.role;
      return next();
    });
}

// Authorize to access Vendor protected route
export function isValidVendor(req, res, next) {
  const accessToken = getToken(req);
  let filter;

  if (!req.params) {
    return fail(res, 403, "Authentication Failed: invalid request parameters.");
  }

  if (!accessToken) {
    return fail(res, 403, "Authentication Failed: undefined token.");
  }

  const { payload: { id, publicAddress, email } } = jwtDecode(accessToken);
  if (publicAddress && email) {
    filter = { publicAddress, email };
  } else if (publicAddress) {
    filter = { publicAddress };
  } else if (email) {
    filter = { email };
  }
  return Vendor.findOne(filter).exec()
  // Step 1: Get the vendor with the given publicAddress
    .then((vendor) => {
      if (!vendor) return notFound(res, `Vendor with publicAddress ${publicAddress} is not found in database.`);
      if (vendor.id !== id) {
        return fail(res, 401, "Vendor verification failed");
      }
      res.locals.userId = id;
      res.locals.userType = "vendor";
      res.locals.userRole = "vendor";
      return next();
    });
}


// Authorize to access Customer protected route
export function isValidCustomer(req, res, next) {
  const accessToken = getToken(req);
  let filter;

  if (!req.params) {
    return fail(res, 403, "Authentication Failed: invalid request parameters.");
  }

  if (!accessToken) {
    return fail(res, 403, "Authentication Failed: undefined token.");
  }

  const { payload: { id, publicAddress, email } } = jwtDecode(accessToken);
  if (publicAddress && email) {
    filter = { publicAddress, email };
  } else if (publicAddress) {
    filter = { publicAddress };
  } else if (email) {
    filter = { email };
  }
  return Customer.findOne(filter).exec()
  // Step 1: Get the customer with the given publicAddress
    .then((customer) => {
      console.log(customer);
      console.log(jwtDecode(accessToken));
      if (!customer) return notFound(res, `Customer with publicAddress ${publicAddress} is not found in database.`);
      if ((customer.id !== id)) {
        return fail(res, 401, "Customer verification failed");
      }
      res.locals.userId = id;
      res.locals.userType = "customer";
      res.locals.userRole = "customer";
      return next();
    });
}

export async function emailSignup(req, res, next) {
  let User = null;
  const { email, password } = req.body;
  const { userType } = req.params;
  console.log(`Email :${email}, Password: ${password} UserType: ${userType}`);
  if (!email || !password) {
    return fail(res, 401, "Request should have signature and publicAddress");
  }
  if (!req.params) {
    return fail(res, 403, "Authentication Failed: invalid request parameters.");
  }
  switch (userType) {
    case "admin": User = Admin;
      break;
    case "vendor": User = Vendor;
      break;
    case "customer": User = Customer;
      break;
    default: return fail(res, 401, "Unknown user type!");
  }

  let user;

  try {
    user = await findEmail(User, email) || {};
  } catch (err) {
    console.error(err);
    return fail(res, 500, `Error finding user with email ${email}. ${err.message}`);
  }

  if (user && (email === user.email)) {
    return fail(res, 500, `User with email already exist. ${email}`);
  }

  return bcrypt.hash(password, saltRounds)
    .then((hash) => {
      const newUser = new User({
        email: req.body.email,
        password: hash,
        notifications: { date: Date.now(), notice: "Please update your profile", standing: "unread" },
      });
      return newUser.save()
        .then(saved => success(res, 200, saved, "new User record has been created"))
        .catch(err => fail(res, 500, `Error creating user. ${err}`));
    })
    .catch(err => fail(res, 500, `Error encrypting user password. ${err}`));
}

export async function emailLogin(req, res, next) {
  let User = null;
  const { email, password } = req.body;
  const { userType } = req.params;
  console.log(`Email :${email}, Password: ${password} UserType: ${userType}`);
  if (!email || !password) {
    return fail(res, 401, "Request should have signature and publicAddress");
  }
  if (!req.params) {
    return fail(res, 403, "Authentication Failed: invalid request parameters.");
  }
  switch (userType) {
    case "admin": User = Admin;
      break;
    case "vendor": User = Vendor;
      break;
    case "customer": User = Customer;
      break;
    default: return fail(res, 401, "Unknown user type!");
  }

  let user;

  try {
    user = await findEmail(User, email) || {};
    console.log(user);
  } catch (err) {
    console.error(err);
    return fail(res, 500, `Error finding user with email ${email}. ${err.message}`);
  }

  const match = await bcrypt.compare(password, user.password);

  if (match) {
  // //////////////////////////////////////////////////
  // Step 4: Create JWT
  // //////////////////////////////////////////////////
    user.nonce = randomNonce();
    return user.save()
      .then(record =>
        new Promise((resolve, reject) =>
          jwt.sign(
            {
              payload: { id: record.id, publicAddress: record.publicAddress, email },
            },
            jwtSecret,
            null,
            (err, token) => {
              if (err) reject(err);
              resolve(token);
            },
          )))
      .then(accessToken => success(res, 200, { accessToken }, "Authentication successful!"))
      .catch(next);
  }
  return fail(res, 403, "Authentication Failed: invalid credentials.");
}
