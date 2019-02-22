/**
 * @author kosiso
 * @property {Object} admin is the staff who assigns the ticket to the Arbitrator
 * @property {String} kind is the type of ticket(arbitration|support|abuse)
 * @property {String} userType is the user that created ticker(customer/vendor)
 * @property {Object} vendor vendorID that created the ticket
 * @property {Object} customer customerID that created the ticket
 * @property {Object} arbitrator is the staff resolving the issue
 * @property {Number} amountDisputed is the amount of money being disputed
 * @property {Object} orderDisputed is the orderID being disputed
 * @property {String} complaint is the complain
 * @property {String} subject is the title of the matter which also be a db.collection
 * such as "product", "category", "brand", "vendor", "customer", "blog", "review", "order"
 * @property {String} subjectId is the id of the dbcollection
 * @property {String} resolution is the verdict by the arbitration
 * @property {Date} assignedDate is the date ticket was assigned
 * @property {Date} resolvedDate is the date the ticket was resolved
 * @property {String} stage Ticket stage which can be "pending", "arbitration", "resolved", "closed"
 * @property {Boolean} escalate Ticket's escalate status by customer or admin
 * @property {String} standing Ticket status which can be "active", "inactive", "trashed"
 * trashed items can be restore after a while if the system has not emptied it automatically
 * @property {Date} updated is the date the ticket was last updated
 * @property {Object} admin  The admin's ObjectId who last modified the record
 * @property {String} action  The admins' action on the record ["allow", "restrict", "deny"]
 * allow: owner can display, transact, update, modify standing or #delete record
 * restrict: owner can update, modify #delete record by cannot display or transact it
 * deny: record cannot be updated, modified, display by owner and its readonly.
*/

import mongoose, { Schema } from "mongoose";
import Admin from "../admin/model";
import Vendor from "../vendor/model";
import Customer from "../customer/model";
import Review from "./../review/model";

const TicketSchema = new Schema({
  admin: { type: Schema.Types.ObjectId, ref: "Admin" },
  kind: { type: String, enum: ["arbitration", "support", "abuse"], required: [true, "Why no kind?"] },
  userType: { type: String, enum: ["customer", "vendor"], required: [true, "Why no complainant?"] },
  vendor: { type: Schema.Types.ObjectId, ref: "Vendor" },
  customer: { type: Schema.Types.ObjectId, ref: "Customer" },
  arbitrator: { type: Schema.Types.ObjectId, ref: "Admin" },
  amountDisputed: { type: Number, required: [false, "Why no Amount?"] },
  complaint: { type: String, required: [false, "Why no complaint?"] },
  subject: {
    type: String,
    enum: ["product", "category", "brand", "vendor", "customer", "blog", "review", "order"],
    required: [true, 'subject must be "product", "category", "brand", "vendor", "customer", "blog", "review", "order"'],
  },
  subjectId: { type: String, required: [true, "Why no subjectId"] },
  resolution: { type: String },
  stage: {
    type: String,
    enum: ["pending", "arbitration", "resolved", "closed"],
    default: "pending",
  },
  escalate: { type: Boolean, default: false },
  review: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  standing: { type: String, enum: ["active", "inactive", "trashed"], default: "active" },
  assignedDate: { type: Date },
  resolvedDate: { type: Date },
  updated: { type: Date, default: Date.now },
  action: { type: String, enum: ["allow", "restrict", "deny"], default: "allow" },
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id; },
  },
});


TicketSchema.index({ createdAt: 1 });

TicketSchema.methods = {
  view(full) {
    const view = {
      id: this.id,
      admin: this.admin,
      kind: this.kind,
      userType: this.userType,
      vendor: this.vendor,
      customer: this.customer,
      arbitrator: this.arbitrator,
      amountDisputed: this.amountDisputed,
      orderDisputed: this.orderDisputed,
      complaint: this.complaint,
      subject: this.subject,
      resolution: this.resolution,
      stage: this.stage,
      standing: this.standing,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      action: this.action,
    };

    return full ? {
      ...view,
      updated: this.updated,
      assignedDate: this.assignedDate,
      resolvedDate: this.resolvedDate,
      admin: this.admin,
    } : view;
  },
};


const Ticket = mongoose.model("Ticket", TicketSchema);
export const { ObjectId } = mongoose.Types.ObjectId;
export default Ticket;
