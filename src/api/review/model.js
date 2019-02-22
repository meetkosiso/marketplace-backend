/**
 * @author kosiso
 * @property {Schema.Types.ObjectId} customer customerID
 * @property {Schema.Types.ObjectId} vendor vendorID
 * @property {String}  subject review subject
 * @property {String} subjectId  subjectID
 * @property {String} comment  review comment
 * @property {String} rating  review rating
 * @property {String} standing  review display status "active", "inactive", "trashed"
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

const ReviewSchema = new Schema({
  customer: { type: Schema.Types.ObjectId, ref: "Customer" },
  vendor: { type: Schema.Types.ObjectId, ref: "Vendor" },
  subject: {
    type: String,
    enum: ["product", "category", "brand", "vendor", "order", "blog", "ticket"],
    required: [true, "Why no subject?"],
  },
  subjectId: { type: String, required: [true, "Why no subject of review?"] },
  comment: { type: String },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  standing: { type: String, enum: ["active", "inactive", "trashed"], default: "active" },
  updated: { type: Date, default: Date.now },
  admin: { type: Schema.Types.ObjectId, ref: "Admin" },
  action: {
    type: String,
    enum: ["allow", "restrict", "deny"],
    default: "allow",
  },
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id; },
  },
});


ReviewSchema.index({ createdAt: 1 });

ReviewSchema.methods = {
  view(full) {
    const view = {
      id: this.id,
      customer: this.customer,
      vendor: this.vendor,
      subject: this.subject,
      subjectId: this.subjectId,
      comment: this.comment,
      rating: this.rating,
      action: this.action,
    };

    return full ? {
      ...view,
      updated: this.updated,
      standing: this.standing,
      admin: this.admin,
    } : view;
  },
};

const Review = mongoose.model("Review", ReviewSchema);
export const { ObjectId } = mongoose.Types.ObjectId;
export default Review;
