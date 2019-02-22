/*
* @author kosiso
* @coauthor Sylvia
*/

import express from "express";
import * as ticket from "./controller";
import { isValidAdmin, isValidVendor, isValidCustomer } from "../auth/controller";

const router = express.Router();


// router.get("/init/ticket", init.initTicket);

/**
 * @api {post} /tickets Create ticket
 * @apiName CreateTicket
 * @apiGroup Ticket
 * @description tickets can be created by anyone even visitors thus
 * it requires NO Atuthentication
 * @apiParam {String} access_token master access token.
 * @apiParam {Schema.Types.ObjectId} admin is the staff who assigns the ticket to the Arbitrator
 * @apiParam {String} kind is the type of ticket(arbitration/support)
 * @apiParam {String} userType is the user that created ticker(customer/vendor)
 * @apiParam {Schema.Types.ObjectId} vendor vendorID that created the ticket
 * @apiParam {Schema.Types.ObjectId} customer customerID that created the ticket
 * @apiParam {Schema.Types.ObjectId} arbitrator is the staff resolving the issue
 * @apiParam {Number} amountDisputed is the amount of money being disputed
 * @apiParam {Schema.Types.ObjectId} orderDisputed is the orderID being disputed
 * @apiParam {String} complaint is the complain
 * @apiParam {String} subject is the title of the matter
 * @apiParam {String} resolution is the verdict by the arbitration
 * @apiParam {Date} assignedDate is the date ticket was assigned
 * @apiParam {Date} resolvedDate is the date the ticket was resolved
 * @apiParam {Date} updated is the date the ticket was last updated
 * @apiSuccess {Object} Ticket Ticket's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Ticket not found.
 * @apiError 401 master access only.
 */
router.post("/tickets/customer", isValidCustomer, ticket.create);
router.post("/tickets/vendor", isValidVendor, ticket.create);

/**
 * @api {get} /tickets/admin Retrieve all tickets
 * @apiName RetrieveTickets
 * @apiGroup Ticket
 * @apiSuccess {Object[]} rows List of Tickets.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get("/tickets/admin", isValidAdmin, ticket.findAll);

/**
 * @api {get} /tickets/vendor Retrieve vendor tickets
 * @apiName RetrieveTicketsVendor
 * @apiGroup Ticket
 * @apiSuccess {Object[]} rows List of Tickets.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get("/tickets/vendor", isValidVendor, ticket.findUserickets);

/**
 * @api {get} /tickets/customer Retrieve customer tickets
 * @apiName RetrieveTicketsCustomer
 * @apiGroup Ticket
 * @apiSuccess {Object[]} rows List of Tickets.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get("/tickets/customer", isValidCustomer, ticket.findUserickets);


/**
 * @api {get} /tickets/:ticketId Retrieve ticket
 * @apiName RetrieveTicket
 * @apiGroup Ticket
 * @description tickets may carry sensitive info thus must be authenticated
 * @apiSuccess {Object} ticket Ticket's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Ticket not found.
 */
router.get("/tickets/:ticketId", isValidAdmin, ticket.findOne);

/**
 * @api {patch} /tickets/:ticketId Modify ticket status by Admin
 * @apiName Modifyicket
 * @apiGroup Ticket
 * @apiPermission master
 * @apiParam {String} access_token master access token.
 * @apiParam {Schema.Types.ObjectId} admin is the staff who assigns the ticket to the Arbitrator
 * @apiParam {String} kind is the type of ticket(arbitration/support)
 * @apiParam {String} userType is the user that created ticker(customer/vendor)
 * @apiParam {Schema.Types.ObjectId} vendor vendorID that created the ticket
 * @apiParam {Schema.Types.ObjectId} customer customerID that created the ticket
 * @apiParam {Schema.Types.ObjectId} arbitrator is the staff resolving the issue
 * @apiParam {Number} amountDisputed is the amount of money being disputed
 * @apiParam {Schema.Types.ObjectId} orderDisputed is the orderID being disputed
 * @apiParam {String} complaint is the complain
 * @apiParam {String} subject is the title of the matter
 * @apiParam {String} resolution is the verdict by the arbitration
 * @apiParam {Date} assignedDate is the date ticket was assigned
 * @apiParam {Date} resolvedDate is the date the ticket was resolved
 * @apiParam {Date} updated is the date the ticket was last updated
 * @apiSuccess {Object} ticket Ticket's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Ticket not found.
 * @apiError 401 master access only.
 */
router.patch("/tickets/admin/:ticketId", isValidAdmin, ticket.modify);

/**
 * @api {put} /tickets/vendor/:ticketId Modify vendor ticket
 * @apiName ModifyicketVendor
 * @apiGroup Ticket
 * @apiPermission master
 * @apiParam {String} access_token master access token.
 * @apiParam {Schema.Types.ObjectId} admin is the staff who assigns the ticket to the Arbitrator
 * @apiParam {String} kind is the type of ticket(arbitration/support)
 * @apiParam {String} userType is the user that created ticker(customer/vendor)
 * @apiParam {Schema.Types.ObjectId} vendor vendorID that created the ticket
 * @apiParam {Schema.Types.ObjectId} customer customerID that created the ticket
 * @apiParam {Schema.Types.ObjectId} arbitrator is the staff resolving the issue
 * @apiParam {Number} amountDisputed is the amount of money being disputed
 * @apiParam {Schema.Types.ObjectId} orderDisputed is the orderID being disputed
 * @apiParam {String} complaint is the complain
 * @apiParam {String} subject is the title of the matter
 * @apiParam {String} resolution is the verdict by the arbitration
 * @apiParam {Date} assignedDate is the date ticket was assigned
 * @apiParam {Date} resolvedDate is the date the ticket was resolved
 * @apiParam {Date} updated is the date the ticket was last updated
 * @apiSuccess {Object} ticket Ticket's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Ticket not found.
 * @apiError 401 master access only.
 */
router.patch("/tickets/vendor/:ticketId", isValidVendor, ticket.modify);

/**
 * @api {put} /tickets/customer/:ticketId Modify customer ticket status
 * @apiName ModifyicketCustomer
 * @apiGroup Ticket
 * @apiPermission master
 * @apiParam {Date} updated is the date the ticket was last updated
 * @apiSuccess {Object} ticket Ticket's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Ticket not found.
 * @apiError 401 master access only.
 */
router.patch("/tickets/customer/:ticketId", isValidCustomer, ticket.modify);

/**
 * @api {delete} /tickets/:id Delete ticket
 * @apiName DeleteTicket
 * @apiGroup Ticket
 * @apiPermission master
 * @apiParam {String} access_token master access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Ticket not found.
 * @apiError 401 master access only.
 */
router.delete("/tickets/admin/:ticketIds(*)", isValidAdmin, ticket.destroy);

/**
 * @api {delete} /tickets/:id Delete array ticket
 * @apiName DeleteTicket
 * @apiGroup Ticket
 * @apiPermission master
 * @apiParam {String} access_token master access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Ticket not found.
 * @apiError 401 master access only.
 */
router.delete("/tickets/admin/:ticketIds(*)", isValidAdmin, ticket.destroy);

export default router;
