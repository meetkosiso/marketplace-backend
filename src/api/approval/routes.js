/*
* @author kosiso
* @coauthor Sylvia
*/

import express from "express";
import { create, findAll, findOne, findByVendor, findByReviewer, findByProduct, update, modify, destroy } from "./controller";
import { isValidVendor, isValidAdmin } from "../auth/controller";
import { init } from "./init";

const router = express.Router();

router.get("/init/approval", init);

/**
 * @api {post} /approvals Create approval
 * @apiName CreateApproval
 * @apiGroup Approval
 * @apiParam {String} access_token master access token.
 * @apiParam {String} kind  Approval type
 * @apiParam {String} title  Approval title
 * @apiParam {String} summary  Approval summary
 * @apiParam {Schema.Types.ObjectId} vendor Vendor that created the approval post
 * @apiParam {String} content  Approval content
 * @apiParam {Array} tag Approval tags
 * @apiParam {String} image  Approval image
 * @apiParam {Number} viewCount Number of views
 * @apiParam {String} standing  Approval status
 * @apiParam {Date} updated Date of last update
 * @apiSuccess {Object} approval Approval's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Approval not found.
 * @apiError 401 master access only.
 */
router.post("/approvals", isValidVendor, create);

/**
* @api {get} /approvals/vendor Retrieve approvals by vendor
* @apiName RetrieveApprovals
* @apiGroup Approval
* @description Non-Auth route. Users can view vendors posts
* @apiSuccess {Object[]} rows List of Approvals.
* @apiError {Object} 400 Some parameters may contain invalid values.
*/
router.get("/approvals/vendor/:vendorId?", findByVendor);
router.get("/approvals/reviewer/:reviewerId?", findByReviewer);
router.get("/approvals/product/:productId", findByProduct);
/**
* @api {get} /approvals/admin Retrieve approvals by Admin
* @apiName RetrieveApprovals
* @apiGroup Approval
* @description Non-Auth route. Admin can view all vendors posts
* @apiSuccess {Object[]} rows List of Approvals.
* @apiError {Object} 400 Some parameters may contain invalid values.
*/
router.get("/approvals/admin", findAll);


/**
 * @api {get} /approvals/:approvalIdRetrieve approval
 * @apiName RetrieveApproval
 * @apiGroup Approval
 * @apiSuccess {Object} approval Approval's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Approval not found.
 */
router.get("/approvals/approval/:approvalId", findOne);

/**
 * @api {put} /approvals/:id Update approval
 * @apiName UpdateApproval
 * @apiGroup Approval
 * @apiPermission master
 * @apiParam {String} access_token master access token.
 * @apiParam {String} kind  Approval type
 * @apiParam {String} title  Approval title
 * @apiParam {String} summary  Approval summary
 * @apiParam {Schema.Types.ObjectId} vendor  Vendor that created the approval post
 * @apiParam {String} content  Approval content
 * @apiParam {Array} tag Approval tags
 * @apiParam {String} image  Approval image
 * @apiParam {Number} viewCount Number of views
 * @apiParam {String} standing  Approval status
 * @apiParam {Date} updated Date of last update
 * @apiSuccess {Object} approval Approval's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Approval not found.
 * @apiError 401 master access only.
 */
router.put("/approvals/:approvalId", isValidVendor, update);

/**
 * @api {put} /approvals/:approvalId Modify a approval status
 * @apiName ModifyApproval
 * @apiGroup Approval
 * @apiPermission master
 * @description a reported approval can be suspended
 * @apiParam {String} access_token master access token.
 * @apiParam {Number} viewCount Number of views
 * @apiParam {String} standing  Approval status
 * @apiParam {Date} updated Date of last update
 * @apiSuccess {Object} approval Approval's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Approval not found.
 * @apiError 401 master access only.
 */
router.patch("/approval/:approvalId", modify);

/**
 * @api {delete} /approvals/:id Delete approval
 * @apiName DeleteApproval
 * @apiGroup Approval
 * @apiPermission master
 * @apiParam  access_token master access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Approval not found.
 * @apiError 401 master access only.
 */
router.delete("/approvals/:approvalId", destroy);
/**
 * @api {delete} /approvals/admin/:approvalIds(*)" Delete array of approvals by Admin
 * @apiName DeleteApprovalArray
 * @apiGroup Approval
 * @apiPermission master
 * @apiParam  access_token master access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Approval not found.
 * @apiError 401 master access only.
 */
router.delete("/approvals/admin/:approvalIds(*)", destroy);


export default router;
