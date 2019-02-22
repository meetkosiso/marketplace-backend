/*
* @author kosiso
* @coauthor Sylvia
*/

import express from "express";
import * as advert from "./controller";
import { isValidVendor, isValidAdmin } from "../auth/controller";
import { initAdvert } from "./init";


const router = express.Router();

router.get("/init/advert", initAdvert);

/**
 * @api {post} /adverts Create advert
 * @apiName CreateAdvert
 * @apiGroup Advert
 * @apiParam {String} access_token master access token.
 * @apiParam {String} kind  Advert type
 * @apiParam {String} title  Advert title
 * @apiParam {String} summary  Advert summary
 * @apiParam {Schema.Types.ObjectId} vendor Vendor that created the advert post
 * @apiParam {String} content  Advert content
 * @apiParam {Array} tag Advert tags
 * @apiParam {String} image  Advert image
 * @apiParam {Number} viewCount Number of views
 * @apiParam {String} standing  Advert status
 * @apiParam {Date} updated Date of last update
 * @apiSuccess {Object} advert Advert's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Advert not found.
 * @apiError 401 master access only.
 */
router.post("/adverts", isValidVendor, advert.create);

/**
* @api {get} /adverts Retrieve adverts by vendor
* @apiName RetrieveAdverts
* @apiGroup Advert
* @description Non-Auth route. Users can view vendors posts
* @apiSuccess {Object[]} rows List of Adverts.
* @apiError {Object} 400 Some parameters may contain invalid values.
*/
router.get("/adverts/vendor/:vendorDomain", advert.findAll);
/**
* @api {get} /adverts/admin Retrieve adverts by Admin
* @apiName RetrieveAdverts
* @apiGroup Advert
* @description Non-Auth route. Admin can view all vendors posts
* @apiSuccess {Object[]} rows List of Adverts.
* @apiError {Object} 400 Some parameters may contain invalid values.
*/
router.get("/adverts/admin", isValidAdmin, advert.findAll);


/**
 * @api {get} /adverts/:advertIdRetrieve advert
 * @apiName RetrieveAdvert
 * @apiGroup Advert
 * @apiSuccess {Object} advert Advert's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Advert not found.
 */
router.get("/adverts/:advertId", advert.findOne);

/**
 * @api {put} /adverts/:id Update advert
 * @apiName UpdateAdvert
 * @apiGroup Advert
 * @apiPermission master
 * @apiParam {String} access_token master access token.
 * @apiParam {String} kind  Advert type
 * @apiParam {String} title  Advert title
 * @apiParam {String} summary  Advert summary
 * @apiParam {Schema.Types.ObjectId} vendor  Vendor that created the advert post
 * @apiParam {String} content  Advert content
 * @apiParam {Array} tag Advert tags
 * @apiParam {String} image  Advert image
 * @apiParam {Number} viewCount Number of views
 * @apiParam {String} standing  Advert status
 * @apiParam {Date} updated Date of last update
 * @apiSuccess {Object} advert Advert's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Advert not found.
 * @apiError 401 master access only.
 */
router.put("/adverts/:advertId", isValidVendor, advert.update);

/**
 * @api {put} /adverts/:advertId Modify a advert status
 * @apiName ModifyAdvert
 * @apiGroup Advert
 * @apiPermission master
 * @description a reported advert can be suspended
 * @apiParam {String} access_token master access token.
 * @apiParam {Number} viewCount Number of views
 * @apiParam {String} standing  Advert status
 * @apiParam {Date} updated Date of last update
 * @apiSuccess {Object} advert Advert's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Advert not found.
 * @apiError 401 master access only.
 */
router.patch("/advert/:advertId", isValidAdmin, advert.modify);

/**
 * @api {delete} /adverts/:id Delete advert
 * @apiName DeleteAdvert
 * @apiGroup Advert
 * @apiPermission master
 * @apiParam  access_token master access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Advert not found.
 * @apiError 401 master access only.
 */
router.delete("/adverts/:advertId", isValidVendor, advert.destroy);
/**
 * @api {delete} /adverts/admin/:advertIds(*)" Delete array of adverts by Admin
 * @apiName DeleteAdvertArray
 * @apiGroup Advert
 * @apiPermission master
 * @apiParam  access_token master access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Advert not found.
 * @apiError 401 master access only.
 */
router.delete("/adverts/admin/:advertIds(*)", isValidAdmin, advert.destroy);


export default router;
