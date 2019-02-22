/*
* @author kosiso
* @coauthor Sylvia
*/

import express from "express";
import * as language from "./controller";
import { isValidAdmin } from "../auth/controller";
import { initLanguage } from "./init";

const router = express.Router();

router.get("/init/language", initLanguage);

/**
 * @api {post} /languages Create language
 * @apiName CreateLanguage
 * @apiGroup Language
 * @apiParam {String} access_token master access token.
 * @apiParam {Schema.Types.ObjectId} admin adminID
 * @apiParam {String} word translated word
 * @apiParam {String} english English translation
 * @apiParam {String} french French translation
 * @apiParam {String} spanish Spanish translation
 * @apiParam {String} bangla Bangla translation
 * @apiParam {String} arabic Arabic translation
 * @apiParam {String} chinese Chinese translation
 * @apiParam {String} standing word status(active/suspended/trashed)
 * @apiParam (Date) updated date of last update
 * @apiSuccess {Object} Language Language's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Language not found.
 * @apiError 401 master access only.
 */
router.post("/languages", isValidAdmin, language.create);

/**
 * @api {get} /languages Retrieve languages
 * @apiName RetrieveLanguages
 * @apiGroup Language
 * @apiSuccess {Object[]} rows List of Languages.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get("/languages", language.findAll);


/**
 * @api {get} /languages/:id Retrieve language
 * @apiName RetrieveLanguage
 * @apiGroup Language
 * @apiSuccess {Object} language Language's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Language not found.
 */
router.get("/languages/:languageId", language.findOne);

/**
 * @api {put} /languages/:id Update language
 * @apiName UpdateLanguage
 * @apiGroup Language
 * @apiPermission master
 * @apiParam {String} access_token master access token.
 * @apiParam {Schema.Types.ObjectId} admin adminID
 * @apiParam {String} word translated word
 * @apiParam {String} english English translation
 * @apiParam {String} french French translation
 * @apiParam {String} spanish Spanish translation
 * @apiParam {String} bangla Bangla translation
 * @apiParam {String} arabic Arabic translation
 * @apiParam {String} chinese Chinese translation
 * @apiParam {String} standing word status(active/suspended/trashed)
 * @apiParam (Date) updated date of last update
 * @apiSuccess {Object} language Language's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Language not found.
 * @apiError 401 master access only.
 */
router.put("/languages/:languageId", isValidAdmin, language.update);

/**
 * @api {delete} /languages/:id Delete language
 * @apiName DeleteLanguage
 * @apiGroup Language
 * @apiPermission master
 * @apiParam {String} access_token master access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Language not found.
 * @apiError 401 master access only.
 */
router.delete("/languages/:languageId", isValidAdmin, language.destroy);

export default router;
