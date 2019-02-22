/**
 * Add this query string to each API call
 * http://127.0.0.1:5000/api/v1/some/call/arrays/of/ids/?key=xyz123&enabled=true&user=all&limit=10&page=0&since=10
 * Valid Entries:
 * key = api key assign to each software
 * enabled = true, false // enable filter
 * user= one, some, all
 * limit = record size or count per page to retrieve
 * page = 0,1,2... // which record page to return
 * since = 0,1,2 // days range created records to be return.
 *
 * userIds = array of records ids to retries slash separated.
 * userType = admin, vendor, customer, visitor // its a params type not a query
 */

import express from "express";
import { initialize, indices, populate, create, findAll, findOne, findSome, destroy } from "./controller";
// import { isValidAdmin, isValidAccess } from "../auth/controller";


const router = express.Router();


router.get("/accesses/setup/initialize", initialize);

router.get("/accesses/setup/indices", indices);

router.get("/accesses/setup/populate", populate);

/**
 * @api {get} /accesses/admin Retrieve all access records
 * @apiName RetrieveAccessesAll
 * @apiGroup Access
 * @apiSuccess {Object[]} rows List of Accesses.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get("/accesses/admin", findAll);

router.get("/accesses/admin/:userType/:userIds(*)", findSome);

/**
 * @api {get} /accesses/user/:recordId Retrieve an access record
 * @apiName RetrieveAccessesOne
 * @apiGroup Access
 * @apiSuccess {Object[]} rows List of Accesses.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get("/accesses/user/:recordId", findOne);

/**
 * @api {get} /accesses/:id Retrieve all access records by a user
 * @apiName RetrieveAccessUser
 * @apiGroup Access
 * @apiSuccess {Object} vendor Access's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Access not found.
 */
router.get("/accesses/user/:userType/:userId", findSome);


/**
 * @api {postt} /accesses/:recordId Create record
 * @apiName CreateAccess
 * @apiGroup Access
 * @apiPermission master
 * @apiParam {String} userId is the vendor's full name
 * @apiParam {String} userType is either admin|vendor|customer|visitor
 * @apiParam {String} accessId is the record's primary key
 * @apiParam {Date} accessDate is the request object timestamp
 * @apiParam {Date} createdAt is the date the record is created
 * @apiSuccess {Object} product Access's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Access not found.
 * @apiError 401 master access only.
 */
router.post("/accesses/user", create);


/**
 * @api {delete} /accesses/:recordId Delete vendor
 * @apiName DeleteAccess
 * @apiGroup Access
 * @apiPermission master
 * @apiParam {String} access_token master access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Access not found.
 * @apiError 401 master access only.
 */
router.delete("/accesses/:recordId", destroy);

export default router;
