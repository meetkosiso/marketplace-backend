/*
* @author kosiso
* @coauthor Sylvia
*/

import express from "express";
import * as subscriber from "./controller";
import { isValidAdmin, isValidVendor, isValidCustomer } from "../auth/controller";
import { initSubscriber } from "./init";

const router = express.Router();


router.get("/init/subscriber", initSubscriber);

/**
 * @api {post} /subscribers Create subscriber
 * @apiName CreateSubscriber
 * @apiGroup Subscriber
 * @apiParam {String} access_token master access token.
 * @apiParam {String} email subscriber's email
 * @apiParam {String} frequency subscriber's email frequency
 * @apiParam {Array} interest subscription type
 * @apiParam {String} standing subscription status(subscriber/unsubscribed, trashed)
 * @apiParam {Date} updated date of last update
 * @apiSuccess {Object} Subscriber Subscriber's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Subscriber not found.
 * @apiError 401 master access only.
 */
router.post("/subscribers", subscriber.create);

/**
 * @api {get} /subscribers Retrieve subscribers
 * @apiName RetrieveSubscribers
 * @apiGroup Subscriber
 * @description Vendors can see all their subscribers and sent them newsletters
 * @apiSuccess {Object[]} rows List of Subscribers.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get("/subscribers/vendor/:vendorDomain", isValidVendor, subscriber.findAll);

/**
 * @description Customers can see all vendors they are subscribed to
 */
router.get("/subscribers/customer/:vendorDomain", isValidCustomer, subscriber.findAll);

/**
 * @api {get} /subscribers/:id Retrieve subscriber
 * @apiName RetrieveSubscriber
 * @apiGroup Subscriber
 * @apiSuccess {Object} subscriber Subscriber’s data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Product not found.
 */
router.get("/subscribers/:subscriberId", isValidAdmin, subscriber.findOne);

/**
 * @api {put} /subscribers/:id Update subscriber
 * @apiName UpdateSubscriber
 * @apiGroup Subscriber
 * @apiPermission master
 * @apiParam {String} access_token master access token.
 * @apiParam {String} email subscriber's email
 * @apiParam {String} frequency subscriber's email frequency
 * @apiParam {Array} interest subscription type
 * @apiParam {String} standing subscription status(subscriber/unsubscribed, trashed)
 * @apiParam {Date} updated date of last update
 * @apiSuccess {Object} subscriber Subscriber's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Product not found.
 * @apiError 401 master access only.
 */
router.put("/subscribers/:subscriberId", isValidCustomer, subscriber.update);


/**
 * @description unsubscribe from a vendor. Any news letter from a vendor must carry this link
 * @api {put} /subscribers/:id Update subscriber
 * @apiName UnSubscribe
 * @apiGroup Subscriber
 * @apiPermission master
 * @apiParam {String} access_token master access token.
 * @apiParam {String} email subscriber's email
 */
router.put("/subscribers/:subscriberId/unsubscribe/:vendorId", subscriber.unsubscribe);

/**
 * @api {delete} /subscribers/:id Delete subscriber
 * @apiName DeleteSubscriber
 * @apiGroup Subscriber
 * @apiPermission master
 * @apiParam {String} access_token master access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Subscriber not found.
 * @apiError 401 master access only.
 */
router.delete("/subscribers/:subscriberId", isValidCustomer, subscriber.destroy);

export default router;
