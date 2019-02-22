/*
*/

import express from "express";
import * as brand from "./controller";
import { isValidVendor, isValidAdmin } from "../auth/controller";
import { initBrand } from "./init";

const router = express.Router();

router.get("/init/brand", initBrand);

router.get("/brands/search", brand.search);
/**
 * @api {post} /brands Create brand
 * @apiName CreateBrand
 * @apiGroup Brand
 * @apiParam {String} access_token master access token.
 * @apiParam {String} name  Brand name
 * @apiParam {String} description  Brand description
 * @apiParam {String} icon  Brand icon
 * @apiParam {String} banner  Brand banner
 * @apiParam {Schema.Types.ObjectId} vendor  Vendor that created brand
 * @apiParam {Number} viewCount  Number of views
 * @apiParam {String} standing  Brand status(active/suspended/trashed)
 * @apiParam {Date} updated Date of last update
 * @apiSuccess {Object} Brand Brand's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Brand not found.
 * @apiError 401 master access only.
 */
router.post("/brands", isValidVendor, brand.create);

/**
 * @api {get} /brands/vendor/:vendorDomain Retrieve brands accroding to vendors
 * @apiName RetrieveBrands
 * @apiGroup Brand
 * @apiParam {String} vendorDomain vendor's domain name
 * @apiSuccess {Object[]} rows List of Brands.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get("/brands/vendor/:vendorDomain", brand.findVendorBrands);

/**
 * @api {get} /brands/admin Retrieve brands by admin
 * @apiName RetrieveBrandsAdmin
 * @apiGroup Brand
 * @apiParam {String} vendorDomain vendor's domain name
 * @apiSuccess {Object[]} rows List of Brands.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get("/brands/admin", isValidAdmin, brand.findAll);


/**
 * @api {get} /brands/:id Retrieve brand
 * @apiName RetrieveBrand
 * @apiGroup Brand
 * @apiSuccess {Object} brand Brand's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Brand not found.
 */
router.get("/brands/:brandId", brand.findOne);

/**
 * @api {put} /brands/:id Update brand
 * @apiName UpdateBrand
 * @apiGroup Brand
 * @apiPermission master
 * @apiParam {String} access_token master access token.
 * @apiParam {String} name  Brand name
 * @apiParam {String} description  Brand description
 * @apiParam {String} icon  Brand icon
 * @apiParam {String} banner  Brand banner
 * @apiParam {Schema.Types.ObjectId} vendor  Vendor that created brand
 * @apiParam {Number} viewCount Number of views
 * @apiParam {String} standing  Brand status(active/suspended/trashed)
 * @apiParam {Date} updated Date of last update
 * @apiSuccess {Object} brand Brand's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Brand not found.
 * @apiError 401 master access only.
 */
router.put("/brands/:brandId", isValidVendor, brand.update);

/**
 * @api {patch} /brands/:brandId Modify brand status
 * @apiName UpdateBrand
 * @apiGroup Brand
 * @apiPermission master
 * @apiParam {String} access_token master access token.
 * @apiParam {Number} viewCount Number of views
 * @apiParam {String} standing  Brand status(active/suspended/trashed)
 * @apiParam {Date} updated Date of last update
 * @apiSuccess {Object} brand Brand's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Brand not found.
 * @apiError 401 master access only.
 */
router.patch("/brands/:brandId", isValidAdmin, brand.modify);

/**
 * @api {delete} /brands/:id Delete brand
 * @apiName DeleteBrand
 * @apiGroup Brand
 * @apiPermission master
 * @apiParam  access_token master access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Brand not found.
 * @apiError 401 master access only.
 */
router.delete("/brands/:brandId", isValidVendor, brand.destroy);
/**
 * @api {delete} /brands/admin/:brandIds(*) Delete array of brands
 * @apiName DeleteBrandArray
 * @apiGroup Brand
 * @apiPermission master
 * @apiParam  access_token master access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Brand not found.
 * @apiError 401 master access only.
 */
router.delete("/brands/admin/:brandIds(*)", isValidAdmin, brand.destroy);

export default router;
