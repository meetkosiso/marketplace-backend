/*
* @author kosiso
*/

import express from "express";
import { create, findOne, findAll } from "./controller";
import { isValidAdmin, isValidVendor, isValidCustomer } from "../auth/controller";
import { initTransaction } from "./init";

const router = express.Router();

router.get("/init/transaction", initTransaction);

/**
 * @api {post} /transactions Create transaction
 * @apiName CreateTransaction
 * @apiGroup Transaction
 * @apiParam {String} access_token master access token.
 * @apiParam {String} code transactions code
 * @apiParam {String} kind type of transactions(system, users, operations)
 * @apiParam {String} name transaction name
 * @apiParam {String} value value of transactions
 * @apiParam {String} description transactions description
 * @apiParam {String} standing transactions status(active/suspended/trashed)
 * @apiParam {Date} updated date of last update
 * @apiSuccess {Object} Transaction Transaction's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Transaction not found.
 * @apiError 401 master access only.
 */
router.post("/transactions/admin", isValidAdmin, create);
router.post("/transactions/vendor", isValidVendor, create);
router.post("/transactions/customer", isValidCustomer, create);

/**
 * @api {get} /transactions Retrieve customer transactions
 * @apiName RetrieveTransactionsCustomer
 * @apiGroup Transaction
 * @description transactions according to kind can be global or for particular users
 * @apiSuccess {Object[]} rows List of Transactions.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get("/transactions/admin", isValidAdmin, findAll);
router.get("/transactions/vendor", isValidVendor, findAll);
router.get("/transactions/customer", isValidCustomer, findAll);

/**
 * @api {get} /transactions/:id Retrieve transaction
 * @apiName RetrieveTransaction
 * @apiGroup Transaction
 * @apiSuccess {Object} transaction Transaction's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Transaction not found.
 */
router.get("/transactions/admin/:transactionId", isValidAdmin, findOne);
router.get("/transactions/vendor/:transactionId", isValidVendor, findOne);
router.get("/transactions/customer/:transactionId", isValidCustomer, findOne);

export default router;
