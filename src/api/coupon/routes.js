/*
* @author kosiso
* @coauthor Sylvia
*/

import express from "express";
import * as coupon from "./controller";
import { isValidVendor, isValidAdmin, isValidCustomer } from "../auth/controller";
import { initCoupon } from "./init";

const router = express.Router();

router.get("/init/coupon", initCoupon);

/**
 * @api {post} /coupons Create coupon
 * @apiName CreateCoupon
 * @apiGroup Coupon
 * @apiParam {String} access_token master access token.
 * @apiParam {Schema.Types.ObjectId} vendor vendor that created coupon
 * @apiParam {String} title coupon title
 * @apiParam {String} code coupon code
 * @apiParam {Number} amount value of coupon in dollars
 * @apiParam {Array} specArray [{name, value}] array of specification
 * @apiParam {Date} till expiry date of coupon
 * @apiParam {String} standing status of coupon (active/expired/trashed)
 * @apiParam {Date} updated date of last update
 * @apiSuccess {Object} Coupon Coupon's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Coupon not found.
 * @apiError 401 master access only.
 */
router.post("/coupons", isValidVendor, coupon.create);

/**
* @api {get} /coupons Retrieve coupons
* @apiName RetrieveCoupons
* @apiGroup Coupon
* @apiSuccess {Object[]} rows List of Coupons.
* @apiError {Object} 400 Some parameters may contain invalid values.
*/
router.get("/coupons/vendor", isValidVendor, coupon.findAll);

/**
* @api {get} /coupons/admin Retrieve vendor coupons by admin
* @apiName RetrieveCouponsAdmin
* @apiGroup Coupon
* @apiSuccess {Object[]} rows List of Coupons.
* @apiError {Object} 400 Some parameters may contain invalid values.
*/
router.get("/coupons/admin", isValidAdmin, coupon.findAll);


/**
 * @api {get} /coupons/:id Retrieve coupon
 * @apiName RetrieveCoupon
 * @apiGroup Coupon
 * @apiSuccess {Object} coupon Coupon's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Coupon not found.
 */
router.get("/coupons/customer/:couponId", isValidCustomer, coupon.findOne);
router.get("/coupons/vendor/:couponId", isValidVendor, coupon.findOne);
router.get("/coupons/admin/:couponId", isValidAdmin, coupon.findOne);

/**
 * @api {put} /coupons/:id Update coupon
 * @apiName UpdateCoupon
 * @apiGroup Coupon
 * @apiPermission master
 * @apiParam {String} access_token master access token.
 * @apiParam {Schema.Types.ObjectId} vendor vendor that created coupon
 * @apiParam {String} title coupon title
 * @apiParam {String} code coupon code
 * @apiParam {Number} amount value of coupon in dollars
 * @apiParam {Array} specArray [{name, value}] array of specification
 * @apiParam {Date} till expiry date of coupon
 * @apiParam {String} standing status of coupon (active/expired/trashed)
 * @apiParam {Date} updated date of last update
 * @apiSuccess {Object} coupon Coupon's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Coupon not found.
 * @apiError 401 master access only.
 */
router.put("/coupons/:couponId", isValidVendor, coupon.update);

/**
 * @api {patch} /coupons/:id Update coupon status by admin
 * @apiName UpdateCoupon
 * @apiGroup Coupon
 * @apiPermission master
 * @apiParam {String} standing status of coupon (active/expired/trashed)
 * @apiParam {Date} updated date of last update
 * @apiSuccess {Object} coupon Coupon's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Coupon not found.
 * @apiError 401 master access only.
 */
router.patch("/coupons/:couponId", isValidAdmin, coupon.modify);

/**
 * @api {delete} /coupons/:id Delete coupon
 * @apiName DeleteCoupon
 * @apiGroup Coupon
 * @apiPermission master
 * @apiParam access_token master access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Coupon not found.
 * @apiError 401 master access only.
 */
router.delete("/coupons/:couponId", isValidVendor, coupon.destroy);

/**
 * @api {delete} /coupons/admin/:couponIds(*)Delete arrays of coupon
 * @apiName DeleteCoupon
 * @apiGroup Coupon
 * @apiPermission master
 * @apiParam access_token master access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Coupon not found.
 * @apiError 401 master access only.
 */
router.delete("/coupons/admin/:couponIds(*)", isValidAdmin, coupon.destroy);

export default router;
