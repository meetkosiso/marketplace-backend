/*
* @author kosiso
* @coauthor Sylvia
*/

import express from "express";
import * as stock from "./controller";
import { isValidVendor, isValidAdmin } from "../auth/controller";
import { initStock } from "./init";

const router = express.Router();

router.get("/init/stock", initStock);

/**
 * @api {post} /stocks Create stock
 * @apiName CreateStock
 * @apiGroup Stock
 * @apiParam {String} access_token master access token.
 * @apiParam {Schema.Types.ObjectId} vendor vendorID
 * @apiParam {Schema.Types.ObjectId} product productId
 * @apiParam {String} orderNum stock number
 * @apiParam {String} kind type of stock(add/destroy)
 * @apiParam {Number} quantity stock of quantity
 * @apiParam {Number} available availabilty number
 * @apiParam {Number} unitCost unit cost of products
 * @apiParam {Number} unitPrice unit price of products
 * @apiParam {String} description stock description
 * @apiParam {String} standing stock status(active/suspended/trashed)
 * @apiParam {Date} updated date of last update
 * @apiSuccess {Object} Stock Stock's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Stock not found.
 * @apiError 401 master access only.
 */
router.post("/stocks", isValidVendor, stock.create);

/**
 * @api {get} /stocks/admin Retrieve stocks by admin
 * @apiName RetrieveStocksAdmin
 * @apiGroup Stock
 * @description Vendors can view all their stock records
 * @apiSuccess {Object[]} rows List of Stock.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get("/stocks/admin", isValidAdmin, stock.findAll);

/**
 * @api {get} /stocks/vendor Retrieve stocks by vendor
 * @apiName RetrieveStocksVendor
 * @apiGroup Stock
 * @description Vendors can view all their stock records
 * @apiSuccess {Object[]} rows List of Stock.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get("/stocks/vendor", isValidVendor, stock.findVendorStocks);

/**
 * @api {get} /stocks/:id Retrieve stock
 * @apiName RetrieveStock
 * @apiGroup Stock
 * @apiSuccess {Object} stock Stock's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Product not found.
 */
router.get("/stocks/:stockId", isValidVendor, stock.findOne);

/**
 * @api {patch} /stocks/:id Update stock
 * @apiName UpdateStock
 * @apiGroup Stock
 * @apiPermission master
 * @apiParam {String} access_token master access token.
 * @apiParam {Schema.Types.ObjectId} vendor vendorID
 * @apiParam {Schema.Types.ObjectId} product productId
 * @apiParam {String} orderNum stock number
 * @apiParam {String} kind type of stock(add/destroy)
 * @apiParam {Number} quantity stock of quantity
 * @apiParam {Number} available availabilty number
 * @apiParam {Number} unitCost unit cost of products
 * @apiParam {Number} unitPrice unit price of products
 * @apiParam {String} description stock description
 * @apiParam {String} standing stock status(active/suspended/trashed)
 * @apiParam {Date} updated date of last update
 * @apiSuccess {Object} stock Stock's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Stock not found.
 * @apiError 401 master access only.
 */
router.patch("/stocks/:stockId", isValidVendor, stock.modify);


export default router;
