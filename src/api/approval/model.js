/**
* @property {String} reviewer  Approval reviewer which is the Vendor who validate the product
* @property {String} product  Approval product
* @property {Object} vendor  Approval Vendor who owns the product
* @property {String} comment  Approval comment or reason for approval/disapproval
* @property {String} approved  Approval approved (true) or disapproved (false)
* @property {String} standing  Approval record status "active", "inactive", "trashed"
* @property {Date} updated  Date of last update
* @property {Object} admin  The admin's ObjectId who last modified the record
* @property {String} action  The admins' action on the record ["allow", "restrict", "deny"]
* allow: owner can display, transact, update, modify standing or #delete record
* restrict: owner can update, modify #delete record by cannot display or transact it
* deny: record cannot be updated, modified, display by owner and its readonly.
*/

import mongoose, { Schema } from "mongoose";
import Admin from "../admin/model";
import Vendor from "../vendor/model";
import Product from "../product/model";

const ApprovalSchema = new Schema({
  reviewer: { type: Schema.Types.ObjectId, ref: "Vendor", required: [true, "Why no Reviewer?"] },
  product: { type: Schema.Types.ObjectId, ref: "Product", required: [true, "Why no Product?"] },
  vendor: { type: Schema.Types.ObjectId, ref: "Vendor", index: true, required: [true, "Why no Product vendor?"] },
  comment: { type: String },
  approved: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
  standing: { type: String, enum: ["active", "inactive", "trashed"], default: "active" },
  updated: { type: Date, default: Date.now },
  admin: { type: Schema.Types.ObjectId, ref: "Admin" },
  action: { type: String, enum: ["allow", "restrict", "deny"], default: "allow" },
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id; },
  },
});

ApprovalSchema.index({ reviewer: 1, product: 1 }, { unique: true });
ApprovalSchema.index({ product: 1, approved: 1 });
ApprovalSchema.index({ createdAt: 1 });

ApprovalSchema.methods = {
  view(full) {
    const view = {
      id: this.id,
      reviewer: this.reviewer,
      product: this.product,
      vendor: this.vendor,
      comment: this.comment,
      approved: this.approved,
      standing: this.standing,
      updatedAt: this.updatedAt,
      createdAt: this.createdAt,
      action: this.action,
    };

    return full ? {
      ...view,
      updated: this.updated,
      admin: this.admin,
    } : view;
  },
};

const Approval = mongoose.model("Approval", ApprovalSchema);
export const { ObjectId } = mongoose.Types.ObjectId;
export default Approval;
