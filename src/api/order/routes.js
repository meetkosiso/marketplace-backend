/*
* @author kosiso
* @coauthor Sylvia
*/

import express from "express";
import * as order from "./controller";
import { isValidAdmin, isValidVendor, isValidCustomer } from "../auth/controller";

const router = express.Router();


// router.get("/init/order", init.initOrder);

/**
 * @api {post} /orders Create order
 * @apiName CreateOrder
 * @apiGroup Order
 * @apiParam {String} access_token master access token.
 * @apiParam {String} orderNum order number
 * @apiParam {Schema.Types.ObjectId} transaction transactionID
 * @apiParam {String} kind type of product(digital/physical)
 * @apiParam {Schema.Types.ObjectId} vendor vendorID
 * @apiParam {Schema.Types.ObjectId} customer customerID
 * @apiParam {Schema.Types.ObjectId} coupon couponID
 * @apiParam {Array} products [{product, quantity, sku, name, unitCost, vat}] product details
 * @apiParam {Array} paymentDetails [{amount, currency, transaction}] payment details
 * @apiParam {Array} shipmentDetails [{recipent, country, state, city, street, building, zip,
 *  phone, email, deliveryNote}] shipment details
 * @apiParam {Array} trackingDetails [{company, code, standing, estimatedDelivery}] tracking details
 * @apiParam {String} orderStatus order status(pending/paid,delivered/canceled)
 * @apiParam {String} standing order standing(active/suspended/trashed)
 * @apiParam {Date} updated date of last update
 * @apiSuccess {Object} Order Order's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Order not found.
 * @apiError 401 master access only.
 */
router.post("/orders/customer", isValidCustomer, order.create);

/**
 * @api {get} /orders Retrieve orders by admin
 * @apiName RetrieveOrders
 * @apiGroup Order
 * @apiSuccess {Object[]} rows List of Orders.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get("/orders/admin", isValidAdmin, order.findAll);

/**
 * @api {get} /orders/vendor Retrieve orders by vendor
 * @apiName RetrieveOrdersVendors
 * @apiGroup Order
 * @apiSuccess {Object[]} rows List of Orders.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get("/orders/vendor", isValidVendor, order.findVendorsOrder);

/**
 * @api {get} /orders/customer Retrieve orders by customer
 * @apiName RetrieveOrdersCustomer
 * @apiGroup Order
 * @apiSuccess {Object[]} rows List of Orders.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get("/orders/customer", isValidCustomer, order.findAll);


/**
 * @api {get} /orders/admin/:orderId Retrieve order by admin
 * @apiName RetrieveOrder
 * @apiGroup Order
 * @apiParam {String} orderId order's id
 * @apiSuccess {Object} order Order's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Order not found.
 */
router.get("/orders/admin/:orderId", isValidAdmin, order.findOne);

/**
 * @api {get} /orders/vendor/:orderId Retrieve order by vendor
 * @apiName RetrieveOrderVendor
 * @apiGroup Order
 * @apiParam {String} orderId order's id
 * @apiSuccess {Object} order Order's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Order not found.
 */
router.get("/orders/vendor/:orderId", isValidVendor, order.findOne);

/**
 * @api {get} /orders/customer/:orderId Retrieve order by customer
 * @apiName RetrieveOrderCustomer
 * @apiGroup Order
 * @apiParam {String} orderId order's id
 * @apiSuccess {Object} order Order's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Order not found.
 */
router.get("/orders/customer/:orderId", isValidCustomer, order.findOne);

/**
 * @api {patch} /orders/admin/:orderId Modify order status by admin
 * @apiName ModifyOrder
 * @apiGroup Order
 * @apiParam {String} standing order standing(active/suspended/trashed)
 * @apiParam {Date} updated date of last update
 * @apiSuccess {Object} order Order's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Order not found.
 * @apiError 401 master access only.
 */
router.patch("/orders/admin/:orderId", isValidAdmin, order.update);

/**
 * @api {patch} /orders/vendor/:orderId Modify order by vendor
 * @apiName ModifyOrderVendor
 * @apiGroup Order
 * @apiParam {String} access_token master access token.
 * @apiParam {Array} shipmentDetails [{recipent, country, state, city, street,
 *  building, zip, phone, email, deliveryNote}] shipment details
 * @apiParam {Array} trackingDetails [{company, code, standing, estimatedDelivery}] tracking details
 * @apiParam {String} orderStatus order status(pending/paid,delivered/canceled)
 * @apiParam {String} standing order standing(active/suspended/trashed)
 * @apiParam {Date} updated date of last update
 * @apiSuccess {Object} order Order's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Order not found.
 * @apiError 401 master access only.
 */
router.patch("/orders/vendor/:orderId", isValidVendor, order.modify);

/**
 * @api {patch} /orders/customer/:orderId Modify order by customer
 * @apiName ModifyOrderCustomer
 * @apiGroup Order
 * @apiParam {String} access_token master access token.
 * @apiParam {Array} shipmentDetails [{recipent, country, state, city, street,
 *  building, zip, phone, email, deliveryNote}] shipment details
 * @apiParam {Array} trackingDetails [{company, code, standing, estimatedDelivery}] tracking details
 * @apiParam {String} orderStatus order status(pending/paid,delivered/canceled)
 * @apiParam {String} standing order standing(active/suspended/trashed)
 * @apiParam {Date} updated date of last update
 * @apiSuccess {Object} order Order's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Order not found.
 * @apiError 401 master access only.
 */
router.patch("/orders/customer/:orderId", isValidCustomer, order.modify);

export default router;
