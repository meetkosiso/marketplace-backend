/*
* @author kosiso
* @coauthor Sylvia
*/

import express from "express";
import * as setting from "./controller";
import { isValidAdmin, isValidVendor, isValidCustomer } from "../auth/controller";
import { initSetting } from "./init";

const router = express.Router();


router.get("/init/settings", initSetting);


/**
 * @api {post} /settings Create setting
 * @apiName CreateSetting
 * @apiGroup Setting
 * @apiParam {String} access_token master access token.
 * @apiParam {String} code settings code
 * @apiParam {String} kind type of settings(system, users, operations)
 * @apiParam {String} name setting name
 * @apiParam {String} value value of settings
 * @apiParam {String} description settings description
 * @apiParam {String} standing settings status(active/suspended/trashed)
 * @apiParam {Date} updated date of last update
 * @apiSuccess {Object} Setting Setting's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Setting not found.
 * @apiError 401 master access only.
 */
router.post("/settings", isValidAdmin, setting.create);

/**
 * @api {get} /settings Retrieve all settings
 * @apiName RetrieveSettings
 * @apiGroup Setting
 * @description settings according to kind can be global or for particular users
 * @apiSuccess {Object[]} rows List of Settings.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get("/settings/admin", isValidAdmin, setting.findAll);

/**
 * @api {get} /settings Retrieve vendor settings
 * @apiName RetrieveSettingsVendor
 * @apiGroup Setting
 * @description settings according to kind can be global or for particular users
 * @apiSuccess {Object[]} rows List of Settings.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get("/settings/vendor", isValidVendor, setting.findAll);

/**
 * @api {get} /settings Retrieve customer settings
 * @apiName RetrieveSettingsCustomer
 * @apiGroup Setting
 * @description settings according to kind can be global or for particular users
 * @apiSuccess {Object[]} rows List of Settings.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get("/settings/customer", isValidCustomer, setting.findAll);

/**
 * @api {get} /settings/:id Retrieve setting
 * @apiName RetrieveSetting
 * @apiGroup Setting
 * @apiSuccess {Object} setting Setting's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Setting not found.
 */
router.get("/settings/:settingId", isValidAdmin, setting.findOne);

/**
 * @api {put} /settings/:id Update setting
 * @apiName UpdateSetting
 * @apiGroup Setting
 * @apiPermission master
 * @apiParam {String} access_token master access token.
 * @apiParam {String} code settings code
 * @apiParam {String} kind type of settings(system, users, operations)
 * @apiParam {String} name setting name
 * @apiParam {String} value value of settings
 * @apiParam {String} description settings description
 * @apiParam {String} standing settings status(active/suspended/trashed)
 * @apiParam {Date} updated date of last update
 * @apiSuccess {Object} setting Setting's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Setting not found.
 * @apiError 401 master access only.
 */
router.put("/settings/:settingId", isValidAdmin, setting.update);

/**
 * @api {delete} /settings/:id Delete setting
 * @apiName DeleteSetting
 * @apiGroup Setting
 * @apiPermission master
 * @apiParam {String} access_token master access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Setting not found.
 * @apiError 401 master access only.
 */
router.delete("/settings/:settingId", isValidAdmin, setting.destroy);

export default router;
