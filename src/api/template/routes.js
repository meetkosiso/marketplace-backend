/*
* @author kosiso
* @coauthor Sylvia
*/

import express from "express";
import * as template from "./controller";
import { isValidAdmin } from "../auth/controller";
import { initTemplate } from "./init";

const router = express.Router();


router.get("/init/template", initTemplate);

/**
 * @api {post} /templates Create template
 * @apiName CreateTemplate
 * @apiGroup Template
 * @apiParam {String} access_token master access token.
 * @apiParam {Schema.Types.ObjectId} admin adminID
 * @apiParam {String} name template name
 * @apiParam {String} page template page(theme, home, profile, product, details,
 *  invoice, ticket, newsletter, mail)
 * @apiParam {String} icon template icon
 * @apiParam {String} style template style
 * @apiParam {Array} placeholders [{attribute, value}] template placeholders
 *  taking property name and value
 * @apiParam {Date} updated date of last update
 * @apiSuccess {Object} Template Template's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Template not found.
 * @apiError 401 master access only.
 */
router.post("/templates", isValidAdmin, template.create);

/**
 * @api {get} /templates Retrieve templates
 * @apiName RetrieveTemplates
 * @apiGroup Template
 * @apiSuccess {Object[]} rows List of Templates.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get("/templates", isValidAdmin, template.findAll);

/**
 * @api {get} /templates/:id Retrieve template
 * @apiName RetrieveTemplate
 * @apiGroup Template
 * @apiSuccess {Object} template Template's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Product not found.
 */
router.get("/templates/:templateId", template.findOne);

/**
 * @api {put} /templates/:id Update template
 * @apiName UpdateTemplate
 * @apiGroup Template
 * @apiPermission master
 * @apiParam {String} access_token master access token.
 * @apiParam {Schema.Types.ObjectId} admin adminID
 * @apiParam {String} name template name
 * @apiParam {String} page template page(theme, home, profile, product,
 *  details, invoice, ticket, newsletter, mail)
 * @apiParam {String} icon template icon
 * @apiParam {String} style template style
 * @apiParam {Array} placeholders [{attribute, value}] template placeholders
 *  taking property name and value
 * @apiParam {Date} updated date of last update
 * @apiSuccess {Object} template Template's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Product not found.
 * @apiError 401 master access only.
 */
router.put("/templates/:templateId", isValidAdmin, template.update);

/**
 * @api {delete} /templates/:id Delete template
 * @apiName DeleteTemplate
 * @apiGroup Template
 * @apiPermission master
 * @apiParam {String} access_token master access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Product not found.
 * @apiError 401 master access only.
 */
router.delete("/templates/:templateId", isValidAdmin, template.destroy);

export default router;
