/**

 */

import express from "express";

import { find, auth, emailSignup, emailLogin } from "./controller";

const router = express.Router();

/**
* @api {get} /:userType/:authType/publicaddress/:publicAddress Authenticate
* @apiName RetrieveNonce
* @apiGroup Authenticate
* @apiPermission master
* @piDescription First step is to find the record with given publicAddress.
* for a new user signup, or  an existing user login,
* return publicAddress, nonce, and authType (signup or login).
* @apiParam {String} access_token master access token.
* @apiParam userType User’s user type (Customer | Vendor | Admin).
* @apiParam authType User’s authentication type.
* @apiParam publicaddress User’s publicaddress.
* @apiSuccess {Object} user User's data.
* @apiError {Object} 400 Some parameters may contain invalid values.
* @apiError 404 User not found.
* @apiError 401 master access only.
*/
// Retrieve a single user with publicAddress ^(0x)?[0-9a-fA-F]{40}$
router.get("/authenticate/metamask/:userType/:authType/publicaddress/:publicAddress", find);

/**
* @api {post} /:userType/auth/:authType Authenticate
* @apiName SignMessage
* @apiGroup Authenticate
* @apiPermission master
* @apiParam {String} access_token master access token.
* @apiParam userType User’s user type (Customer | Vendor | Admin).
* @apiParam authType User’s authentication type.
* @apiParam publicaddress User’s publicaddress posted in in the body.
* @apiParam signature User’s signature posted in in the body.
* @apiSuccess {Object} user User's data.
* @apiError {Object} 400 Some parameters may contain invalid values.
* @apiError 404 User not found.
* @apiError 401 master access only.
*/
router.post("/authenticate/metamask/:userType/auth/:authType", auth);

router.post("/authenticate/email/:userType/signup", emailSignup);

router.post("/authenticate/email/:userType/login", emailLogin);


export default router;
