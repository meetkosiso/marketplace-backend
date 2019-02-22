/*
* @author kosiso
* @coauthor Sylvia
*/

import express from "express";
import * as message from "./controller";
import { isValidAdmin, isValidVendor, isValidCustomer } from "../auth/controller";
import { initMessage } from "./init";

const router = express.Router();

router.get("/init/message", initMessage);

/**
 * @api {post} /messages Create message
 * @apiName CreateMessage
 * @apiGroup Message
 * @apiParam {String} access_token master access token.
 * @apiParam {Schema.Types.ObjectId} admin AdminId
 * @apiParam {String} vendor VendorId
 * @apiParam {String} customer CustomerID
 * @apiParam {String} visitorName name of visitor
 * @apiParam {String} visitorEmail email of visitor
 * @apiParam {String} sentBy user who sent the message(visitor/customer/vendor/admin)
 * @apiParam {String} kind message kind(chat/contact/ticket)
 * @apiParam {String} messageSession message session
 * @apiParam {String} messageBetween message between
 *  type(visitor_vendor/customer_vendor/customer_admin/vendor_admin)
 * @apiParam {String} subject message subject
 * @apiParam {String} message message body
 * @apiParam {String} standing message status(read, unread, trashed)
 * @apiParam {Date} updated date of last update
 * @apiSuccess {Object} Message Message's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Message not found.
 * @apiError 401 master access only.
 */
router.post("/messages", message.create);
router.post("/messages/customer", isValidCustomer, message.create);
router.post("/messages/vendor", isValidVendor, message.create);

/**
 * @api {get} /messages/admin/" Retrieve messages by admin
 * @apiName RetrieveMessagesAdmin
 * @apiGroup Message
 * @apiSuccess {Object[]} rows List of Messages.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get("/messages/admin/", isValidAdmin, message.findAll);

/**
 * @api {get} /messages/vendor/" Retrieve messages by vendor
 * @apiName RetrieveMessagesVendor
 * @apiGroup Message
 * @apiSuccess {Object[]} rows List of Messages.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
// router.get("/messages/vendor/", isValidVendor, message.findAll);
router.get("/messages/vendor/:ticketId", message.findUserTicket);

/**
 * @api {get} /messages/customer/" Retrieve messages by customer
 * @apiName RetrieveMessagesCustomer
 * @apiGroup Message
 * @apiSuccess {Object[]} rows List of Messages.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get("/messages/customer/:ticketId", message.findUserTicket);

/**
 * @api {get} /messages/visitor/:visitorId" Retrieve messages by visitor
 * @apiName RetrieveMessagesVisitor
 * @apiGroup Message
 * @apiParam visitorId is the temporary chat session id assign to a visitor
 * @apiSuccess {Object[]} rows List of Messages.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get("/messages/visitor/:visitorId", message.findAll);


/**
 * @api {get} /messages/:id Retrieve message by admin
 * @apiName RetrieveMessage
 * @apiGroup Message
 * @apiSuccess {Object} message Message's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Message not found.
 */
router.get("/messages/:messageId", isValidAdmin, message.findOne);

/**
 * @api {patch} /messages/admin/:messageId Modify message status
 * @apiName ModifyMessage
 * @apiGroup Message
 * @apiPermission master
 * @description Message cannot be updated. Only its status can be modified
 * @apiParam {String} access_token master access token.
 * @apiParam {Schema.Types.ObjectId} admin AdminId
 * @apiParam {String} standing message status(read, unread, trashed)
 * @apiParam {Date} updated date of last update
 * @apiSuccess {Object} message Message's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Message not found.
 * @apiError 401 master access only.
 */
router.patch("/messages/admin/:messageId", isValidAdmin, message.modify);

/**
 * @api {patch} /messages/vendor/:messageId Modify vendor message status
 * @apiName ModifyMessage
 * @apiGroup Message
 * @apiPermission master
 * @description Message cannot be updated. Only its status can be modified
 * @apiParam {String} access_token master access token.
 * @apiParam {Schema.Types.ObjectId} admin AdminId
 * @apiParam {String} standing message status(read, unread, trashed)
 * @apiParam {Date} updated date of last update
 * @apiSuccess {Object} message Message's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Message not found.
 * @apiError 401 master access only.
 */
router.patch("/messages/vendor/:messageId", isValidVendor, message.modify);

/**
 * @api {patch} /messages/customer/:messageId Modify customer message status
 * @apiName ModifyMessage
 * @apiGroup Message
 * @apiPermission master
 * @description Message cannot be updated. Only its status can be modified
 * @apiParam {String} access_token master access token.
 * @apiParam {Schema.Types.ObjectId} admin AdminId
 * @apiParam {String} standing message status(read, unread, trashed)
 * @apiParam {Date} updated date of last update
 * @apiSuccess {Object} message Message's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Message not found.
 * @apiError 401 master access only.
 */
router.patch("/messages/customer/:messageId", isValidCustomer, message.modify);

/**
 * @api {delete} /messages/:id Delete message
 * @apiName DeleteMessage
 * @apiGroup Message
 * @apiPermission master
 * @apiParam {String} access_token master access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Message not found.
 * @apiError 401 master access only.
 */
router.delete("/messages/:messageId", isValidVendor, message.destroy);

/**
 * @api {delete} /messages/admin/:messageIds(*) Delete array of message
 * @apiName DeleteMessageArray
 * @apiGroup Message
 * @apiPermission master
 * @apiParam {String} messageIds slash-separated message Ids
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Message not found.
 * @apiError 401 master access only.
 */
router.delete("/messages/admin/:messageIds(*)", isValidAdmin, message.destroy);

export default router;
