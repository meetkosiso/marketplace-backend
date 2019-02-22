/**
 * @author kosiso
 * @property {String} vendor VendorId
 * @property {String} customer CustomerID
 * @property {String} visitorName name of visitor
 * @property {String} visitorEmail email of visitor
 * @property {String} sentBy user who sent the message(visitor/customer/vendor/admin)
 * @property {String} kind message kind(chat/contact/ticket)
 * @property {String} messageSession message session
 * @property {String} messageBetween message between
 * type(visitor_vendor/customer_vendor/customer_admin/vendor_admin)
 * @property {String} subject message subject
 * @property {String} message message body
 * @property {String} standing message read status "active", "inactive", "trashed"
* trashed items can be restore after a while if the system has not emptied it automatically
 * @property {Date} updated date of last update
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
import Ticket from "../ticket/model";

const MessageSchema = new Schema({
  admin: { type: Schema.Types.ObjectId, ref: "Admin" },
  vendor: { type: Schema.Types.ObjectId, ref: "Vendor" },
  customer: { type: Schema.Types.ObjectId, ref: "Customer" },
  visitorName: { type: String },
  visitorEmail: { type: String },
  sentBy: {
    type: String,
    enum: ["visitor", "customer", "vendor", "admin"],
    required: [true, "Why no sender?"],
  },
  kind: {
    type: String,
    enum: ["chat", "contact", "ticket"],
    required: [true, "Why no communication type?"],
  },
  messageSession: { type: String, required: [true, "Why no messageSession?"] },
  messageBetween: {
    type: String,
    enum: ["visitor_vendor", "customer_vendor", "customer_admin", "vendor_admin"],
    required: [true, "Why no communication party?"],
  },
  subject: { type: String },
  message: { type: String },
  standing: { type: String, enum: ["active", "inactive", "trashed"], default: "active" },
  updated: { type: Date, default: Date.now },
  action: { type: String, enum: ["allow", "restrict", "deny"], default: "allow" },
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    toJSON: (obj, ret) => { delete ret._id; },
  },
});

MessageSchema.index({ createdAt: 1 });

MessageSchema.methods = {
  view(full) {
    const view = {
      id: this.id,
      kind: this.kind,
      messageSession: this.messageSession,
      messageBetween: this.messageBetween,
      visitorName: this.visitorName,
      visitorEmail: this.visitorEmail,
      subject: this.subject,
      message: this.message,
      customer: this.customer,
      vendor: this.vendor,
      sentBy: this.sentBy,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      action: this.action,
    };

    return full ? {
      ...view,
      updated: this.updated,
      standing: this.standing,
      admin: this.standing,
    } : view;
  },
};

const Message = mongoose.model("Message", MessageSchema);
export const { ObjectId } = mongoose.Types.ObjectId;
export default Message;
