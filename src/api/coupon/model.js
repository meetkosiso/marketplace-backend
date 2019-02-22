/**
* @author kosiso
* @property {Object} vendor vendor that created coupon
* @property {String}  title coupon title
* @property {String} code coupon code
* @property {Number} amount value of coupon in dollars
* @property {Array} specArray [{name, value}] array of specification
* @property {Date} till expiry date of coupon
* @property {String} standing status of coupon expiry which can be "active", "inactive", "trashed"
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


const CouponSchema = new Schema({
  vendor: { type: Schema.Types.ObjectId, ref: "Vendor", required: [true, "Why no Vendor?"] },
  title: { type: String, required: [true, "Why no title of coupon?"] },
  code: { type: String, required: [true, "Why no code of code?"] },
  amount: { type: Number, required: [true, "Why no dollar amount waiver of coupon?"] },
  till: { type: Date, required: [true, "Why no expiry date of coupon?"] },
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

CouponSchema.methods = {
  view(full) {
    const view = {
      id: this.id,
      vendor: this.vendor,
      title: this.title,
      code: this.code,
      amount: this.amount,
      till: this.till,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      standing: this.standing,
      action: this.action,
    };

    return full ? {
      ...view,
      updated: this.updated,
      admin: this.admin,
    } : view;
  },
};

const Coupon = mongoose.model("Coupon", CouponSchema);
export const { ObjectId } = mongoose.Types.ObjectId;
export default Coupon;
