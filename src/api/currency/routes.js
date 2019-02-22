/*
* @author kosiso
* @coauthor Sylvia
*/

import express from "express";
import { create, update, findOne, findAll, findExchange, findActive, destroy } from "./controller";
import { isValidAdmin } from "../auth/controller";
import { initCurrency } from "./init";


const router = express.Router();


router.get("/init/currency", initCurrency);

/**
 * @api {post} /currencies Create currency
 * @apiName CreateCurrency
 * @apiGroup Currency
 * @apiParam {String} access_token master access token.
 * @apiParam {Schema.Types.ObjectId} admin adminID that created currency
 * @apiParam {String} name currency name
 * @apiParam {String} ode currency code
 * @apiParam {String} description currency description
 * @apiParam {String} kind type of currency (digital/fiat)
 * @apiParam {String} symbol currency symbol
 * @apiParam {Number} exchange currency exchange rate
 * @apiParam {String} icon currency icon
 * @apiParam {Number} viewCount number of view counts
 * @apiParam {String} standing status of currency (active/suspended/trashed)
 * @apiParam {Date} updated date of last update
 * @apiSuccess {Object} Currency Currency's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Currency not found.
 * @apiError 401 master access only.
 */
router.post("/currencies/admin", isValidAdmin, create);

/**
 * @api {get} /currencies/admin Retrieve all currencies
 * @apiName RetrieveCurrencys
 * @apiGroup Currency
 * @apiSuccess {Object[]} rows List of Currencys.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get("/currencies/admin", findAll);

/**
 * @api {get} /currencies/active Retrieve active currencies
 * @apiName RetrieveCurrencys
 * @apiGroup Currency
 * @apiSuccess {Object[]} rows List of Currencys.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get("/currencies/active", findActive);


/**
 * @api {get} /currencies/:id Retrieve currency
 * @apiName RetrieveCurrency
 * @apiGroup Currency
 * @apiSuccess {Object} currency Currency's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Currency not found.
 */
// router.get("/currencies/currency/:currencyId", currency.findOne);


/**
 * @api {get} /currencies/:id Retrieve currency
 * @apiName RetrieveCurrency
 * @apiGroup Currency
 * @apiSuccess {Object} currency Currency's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Currency not found.
 */
router.get("/currencies/exchange/:amount/:currency/:conversion", findExchange);

/**
 * @api {put} /currencies/:id Update currency
 * @apiName UpdateCurrency
 * @apiGroup Currency
 * @apiPermission master
 * @apiParam {String} access_token master access token.
 * @apiParam {Schema.Types.ObjectId} admin adminID that created currency
 * @apiParam {String} name currency name
 * @apiParam {String} ode currency code
 * @apiParam {String} description currency description
 * @apiParam {String} kind type of currency (digital/fiat)
 * @apiParam {String} symbol currency symbol
 * @apiParam {Number} exchange currency exchange rate
 * @apiParam {String} icon currency icon
 * @apiParam {Number} viewCount number of view counts
 * @apiParam {String} standing status of currency (active/suspended/trashed)
 * @apiParam {Date} updated date of last update
 * @apiSuccess {Object} currency Currency's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Currency not found.
 * @apiError 401 master access only.
 */
router.put("/currencies/:currencyId", isValidAdmin, update);

/**
 * @api {delete} /currencies/:id Delete currency
 * @apiName DeleteCurrency
 * @apiGroup Currency
 * @apiPermission master
 * @apiParam access_token master access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Currency not found.
 * @apiError 401 master access only.
 */
router.delete("/currencies/currency/:currencyId", isValidAdmin, destroy);

export default router;
