/*
* @author kosiso
* @author Odewale Ifeoluwa
* @coauthor Sylvia
*/

import express from "express";
import * as media from "./controller";
import { isValidAdmin, isValidVendor } from "../auth/controller";
import { initMedia } from "./init";

const router = express.Router();


router.get("/init/media", initMedia);

/**
 * @api {post} /media Create media
 * @apiName CreateMedia
 * @apiGroup Media
 * @apiParam {String} access_token master access token.
 * @apiParam {String} mediaType type of media
 * @apiParam {Schema.Types.ObjectId} vendor vendorId
 * @apiParam {String} purpose media purpose(slide/picture/banner/background)
 * @apiParam {Array} page [{product, stock, vendor, brand, category, blog}] pages to display media
 * @apiParam {String} place media location
 * @apiParam {String} num media number
 * @apiParam {String} url media url
 * @apiParam {String} title media title
 * @apiParam {String} description media description
 * @apiParam {String} style media style
 * @apiParam {String} standing media status(active, suspended, trashed)
 * @apiParam {Date} updated last update date
 * @apiSuccess {Object} Media Media's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Media not found.
 * @apiError 401 master access only.
 */
router.post("/media", isValidVendor, media.create);

/**
 * @api {get} /media Retrieve media
 * @apiName RetrieveMedias
 * @apiGroup Media
 * @apiSuccess {Object[]} rows List of Medias.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get("/media/vendor/:vendorDomain", media.findAll);


/**
 * @api {get} /media/:id Retrieve media
 * @apiName RetrieveMedia
 * @apiGroup Media
 * @apiSuccess {Object} media Media's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Media not found.
 */
router.get("/media/:mediaId", media.findOne);

/**
 * @api {put} /media/:id Update media
 * @apiName UpdateMedia
 * @apiGroup Media
 * @apiPermission master
 * @apiParam {String} access_token master access token.
 * @apiParam {String} mediaType type of media
 * @apiParam {Schema.Types.ObjectId} vendor vendorId
 * @apiParam {String} purpose media purpose(slide/picture/banner/background)
 * @apiParam {Array} page [{product, stock, vendor, brand, category, blog}] pages to display media
 * @apiParam {String} place media location
 * @apiParam {String} num media number
 * @apiParam {String} url media url
 * @apiParam {String} title media title
 * @apiParam {String} description media description
 * @apiParam {String} style media style
 * @apiParam {String} standing media status(active, suspended, trashed)
 * @apiParam {Date} updated last update date
 * @apiSuccess {Object} media Media's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Media not found.
 * @apiError 401 master access only.
 */
router.put("/media/:mediaId", isValidVendor, media.updateImg);

router.put("/media/admin/:mediaId", isValidAdmin, media.updateImg);


/**
 * @api {patch} /media/:id Modify media status media
 * @apiName UpdateMedia
 * @apiGroup Media
 * @apiPermission master
 * @apiParam {String} standing media status(active, suspended, trashed)
 * @apiParam {Date} updated last update date
 * @apiSuccess {Object} media Media's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Media not found.
 * @apiError 401 master access only.
 */
// router.patch("/media/:mediaId", isValidAdmin, media.modify);

/**
 * @api {delete} /media/:id Delete media
 * @apiName DeleteMedia
 * @apiGroup Media
 * @apiPermission master
 * @apiParam {String} access_token master access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Media not found.
 * @apiError 401 master access only.
 */
router.delete("/media/:mediaId", isValidVendor, media.destroy);

/**
 * @api {delete} /media/admin/:mediaId(*)Delete array of media
 * @apiName DeleteMedia
 * @apiGroup Media
 * @apiPermission master
 * @apiParam {String} access_token master access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Media not found.
 * @apiError 401 master access only.
 */
router.delete("/media/admin/:mediaId(*)", isValidAdmin, media.destroy);

export default router;
