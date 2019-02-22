/*
* @author kosiso
* @coauthor Sylvia
*/

import express from "express";
import * as mail from "./controller";
import { isValidAdmin } from "../auth/controller";
import { initMail } from "./init";

const router = express.Router();


router.get("/init/mail", initMail);

/**
 * @api {post} /mails Create mail
 * @apiName CreateMail
 * @apiGroup Mail
 * @apiParam {String} access_token master access token.
 * @apiParam {String} createdType type of mail
 * @apiParam {String} createdBy userId of the user(admin/vendor) who created the mail
 * @apiParam {String} name name of mail
 * @apiParam {String} kind kind of mail(notification/newsletter/advert)
 * @apiParam {String} language mail language
 * @apiParam {String} mailSubject mail subject
 * @apiParam {String} mailBody mail content
 * @apiParam {String} recipient mail recipent(vendor/customer/subscriber)
 * @apiParam {String} standing mail status(active/suspended/trashed)
 * @apiParam {Date} updated date of mail last update
 * @apiSuccess {Object} Mail Mail's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Mail not found.
 * @apiError 401 master access only.
 */
router.post("/mails", isValidAdmin, mail.create);

router.get("/mails/testing", mail.testing);

/**
 * @api {get} /mails Retrieve mails
 * @apiName RetrieveMails
 * @apiGroup Mail
 * @apiSuccess {Object[]} rows List of Mails.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get("/mails", isValidAdmin, mail.findAll);


/**
 * @api {get} /mails/:id Retrieve mail
 * @apiName RetrieveMail
 * @apiGroup Mail
 * @apiSuccess {Object} mail Mail's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Mail not found.
 */
router.get("/mails/:mailId", isValidAdmin, mail.findOne);

/**
 * @api {put} /mails/:id Update mail
 * @apiName UpdateMail
 * @apiGroup Mail
 * @apiPermission master
 * @apiParam {String} access_token master access token.
 * @apiParam {String} createdType type of mail
 * @apiParam {String} createdBy userId of the user(admin/vendor) who created the mail
 * @apiParam {String} name name of mail
 * @apiParam {String} kind kind of mail(notification/newsletter/advert)
 * @apiParam {String} language mail language
 * @apiParam {String} mailSubject mail subject
 * @apiParam {String} mailBody mail content
 * @apiParam {String} recipient mail recipent(vendor/customer/subscriber)
 * @apiParam {String} standing mail status(active/suspended/trashed)
 * @apiParam {Date} updated date of mail last update
 * @apiSuccess {Object} mail Mail's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Mail not found.
 * @apiError 401 master access only.
 */
router.put("/mails/:mailId", isValidAdmin, mail.update);

/**
 * @api {delete} /mails/:id Delete mail
 * @apiName DeleteMail
 * @apiGroup Mail
 * @apiPermission master
 * @apiParam {String} access_token master access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Mail not found.
 * @apiError 401 master access only.
 */
router.delete("/mails/:mailId", isValidAdmin, mail.destroy);


export default router;
