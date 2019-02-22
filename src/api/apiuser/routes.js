/*
* @author kosiso
* @coauthor Sylvia
*/

import express from "express";
import * as apiuser from "./controller";
import { isValidAdmin } from "../auth/controller";
import { initApiuser } from "./init";

const router = express.Router();

router.get("/init/apiuser", initApiuser);

/**
 * @api {get} /apiusers Retrieve apiusers
 * @apiName RetrieveAdmins
 * @apiGroup Admin
 * @apiSuccess {Object[]} rows List of Admins.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get("/apiusers", isValidAdmin, apiuser.findAll);


/**
 * @api {get} /apiusers/:apiuserId Retrieve apiuser
 * @apiName RetrieveAdmin
 * @apiGroup Admin
 * @apiSuccess {Object} apiuser Admin's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Admin not found.
 */
router.get("/apiusers/apiuser", isValidAdmin, apiuser.findOne);


/**
 * @api {put} /apiusers Update apiuser
 * @apiName UpdateAdmin
 * @apiGroup Admin
 * @apiPermission master
 * @apiParam {String} access_token master access token.
 * @apiParam {Number} nonce authentication nonce generated every time
 * @apiParam {String} publicAddress  Metamask public address
 * @apiParam {String} username  apiuser's username
 * @apiParam {String} role  apiuser's role
 * @apiParam {Array} lastAccess [{accessDate, ipAddress}] user's last login/access
 * @apiParam {String} fullname  apiuser's first and last name
 * @apiParam {String} phone  apiuser's phone number
 * @apiParam {String} address  apiuser's physical address
 * @apiParam {String} email  apiuser's email address
 * @apiParam {String} password  apiuser's password
 * @apiParam {Array} notifications [{date, notice, standing}] apiuser's notifications
 * @apiParam {String} standing  apiuser's status
 * @apiParam {Date} updated update date
 * @apiParam {String} updatedBy  AdminID of staff who updated the record
 * @apiparam {Boolean} onlineStatus apiuser's online Status
 * @apiSuccess {Object} apiuser Admin's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Admin not found.
 * @apiError 401 master access only.
 */
router.put("/apiusers", isValidAdmin, apiuser.update);

/**
 * @api {patch} /apiusers/:apiuserId Modify apiuser
 * @apiName ModifyAdmin
 * @apiGroup Admin
 * @apiPermission master
 * @apiParam {String} access_token master access token.
 * @apiParam {Number} nonce authentication nonce generated every time
 * @apiParam {String} publicAddress  Metamask public address
 * @apiParam {String} username  apiuser's username
 * @apiParam {String} role  apiuser's role
 * @apiParam {Array} lastAccess [{accessDate, ipAddress}] user's last login/access
 * @apiParam {String} fullname  apiuser's first and last name
 * @apiParam {String} phone  apiuser's phone number
 * @apiParam {String} address  apiuser's physical address
 * @apiParam {String} email  apiuser's email address
 * @apiParam {Array} notifications [{date, notice, standing}] apiuser's notifications
 * @apiParam {String} standing  apiuser's status
 * @apiParam {Date} updated update date
 * @apiParam {String} updatedBy  AdminID of staff who updated the record
 * @apiparam {Boolean} onlineStatus apiuser's online Status
 * @apiSuccess {Object} apiuser Admin's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Admin not found.
 * @apiError 401 master access only.
 */
router.patch("/apiusers/:apiuserId", isValidAdmin, apiuser.modify);

/**
 * @api {delete} /apiusers/:apiuserId Delete apiuser
 * @apiName DeleteAdmin
 * @apiGroup Admin
 * @apiPermission master
 * @apiParam  access_token master access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Admin not found.
 * @apiError 401 master access only.
 */
router.delete("/apiusers/:apiuserId", isValidAdmin, apiuser.destroy);


export default router;
