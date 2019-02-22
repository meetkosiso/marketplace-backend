/*
* @author kosiso
* @coauthor Sylvia
*/

import { Router } from "express";
import { findOne, findAll, create, update, destroy } from "./controller";
import { isValidAdmin } from "../auth/controller";
import { initCollection } from "./init";


const router = new Router();

router.get("/init/collection", initCollection);

/**
 * @api {post} /collections Create collection
 * @apiName CreateCollection
 * @apiGroup Collection
 * @apiParam {String} access_token master access token.
 * @apiParam {String} name name of collection
 * @apiParam {String} description collection description
 * @apiParam {String} kind collection type (digital/physical)
 * @apiParam {String} icon collection icon
 * @apiParam {String} banner collection banner
 * @apiParam {String} parent parent collection
 * @apiParam {String} standing status of collection (active/suspended/trashed)
 * @apiParam {Date} updated date of last update
 * @apiSuccess {Object} Collection Collection's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Collection not found.
 * @apiError 401 master access only.
 */
router.post("/collections/collection", isValidAdmin, create);

/**
 * @api {get} /collections/admin Retrieve all collectionsby admin
 * @apiName RetrieveAllCategories
 * @apiGroup Collection
 * @apiSuccess {Object[]} rows List of Collections.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get("/collections", findAll);


/**
 * @api {get} /collections/:collectionId Retrieve collection
 * @apiName RetrieveCollection
 * @apiGroup Collection
 * @apiParam collectionId collection's Id
 * @apiSuccess {Object} collection Collection's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Collection not found.
 */
router.get("/collections/:collectionId", findOne);

/**
 * @api {put} /collections/:collectionId create sub collection by vendor
 * @apiName CreateVendorCollection
 * @apiGroup Collection
 * @apiPermission master
 * @apiParam {String} access_token master access token.
 * @apiParam {String} name name of collection
 * @apiParam {String} description collection description
 * @apiParam {String} kind collection type (digital/physical)
 * @apiParam {String} icon collection icon
 * @apiParam {String} banner collection banner
 * @apiParam {String} parent parent collection
 * @apiParam {String} standing status of collection (active/suspended/trashed)
 * @apiParam {Date} updated date of last update
 * @apiSuccess {Object} collection Collection's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Collection not found.
 * @apiError 401 master access only.
 */
router.put("/collections/:collectionId", isValidAdmin, update);


/**
 * @api {delete} /collections/:collectionIds(*) Delete array of collection by Admin
 * @apiName DeleteCollectionArray
 * @apiGroup Collection
 * @apiPermission master
 * @apiParam {String} collectionIds slash-separated arrays of Ids
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Collection not found.
 * @apiError 401 master access only.
 */
router.delete("/collections/:collectionId(*)", isValidAdmin, destroy);


export default router;
