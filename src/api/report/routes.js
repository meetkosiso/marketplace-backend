/*
* @author kosiso
* @coauthor Sylvia
*/

import express from "express";
import { create, update, findAll, findOne, generate, destroy } from "./controller";
import { isValidAdmin, isValidVendor, isValidCustomer } from "../auth/controller";
import { initReport } from "./init";

const router = express.Router();

router.get("/init/report", initReport);

/**
 * @api {post} /reports Create report
 * @apiName Createreport
 * @apiGroup report
 * @apiParam {String} access_token master access token.
 * @apiParam {String} code reports code
 * @apiParam {String} name report name
 * @apiParam {String} description reports description
 * @apiParam {String} standing reports status(active/suspended/trashed)
 * @apiParam {Date} updated date of last update
 * @apiSuccess {Object} report report's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 report not found.
 * @apiError 401 master access only.
 */
router.post("/reports/admin", isValidAdmin, create);

/**
 * @api {get} /reports Retrieve all reports
 * @apiName Retrievereports
 * @apiGroup report
 * @description reports according to kind can be global or for particular users
 * @apiSuccess {Object[]} rows List of reports.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get("/reports/admin", isValidAdmin, findAll);

/**
 * @api {get} /reports Retrieve vendor reports
 * @apiName RetrievereportsVendor
 * @apiGroup report
 * @description reports according to kind can be global or for particular users
 * @apiSuccess {Object[]} rows List of reports.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get("/reports/vendor", isValidVendor, findAll);
router.get("/reports/generate/:code", isValidVendor, generate);


/**
 * @api {get} /reports/:id Retrieve report
 * @apiName Retrievereport
 * @apiGroup report
 * @apiSuccess {Object} report report's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 report not found.
 */
router.get("/reports/admin/:reportId", isValidAdmin, findOne);

/**
 * @api {put} /reports/:id Update report
 * @apiName Updatereport
 * @apiGroup report
 * @apiPermission master
 * @apiParam {String} access_token master access token.
 * @apiParam {String} code reports code
 * @apiParam {String} name report name
 * @apiParam {String} description reports description
 * @apiParam {String} standing reports status(active/suspended/trashed)
 * @apiParam {Date} updated date of last update
 * @apiSuccess {Object} report report's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 report not found.
 * @apiError 401 master access only.
 */
router.put("/reports/admin/:reportId", isValidAdmin, update);

/**
 * @api {delete} /reports/:id Delete report
 * @apiName Deletereport
 * @apiGroup report
 * @apiPermission master
 * @apiParam {String} access_token master access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 report not found.
 * @apiError 401 master access only.
 */
router.delete("/reports/admin/:reportId", isValidAdmin, destroy);

export default router;
