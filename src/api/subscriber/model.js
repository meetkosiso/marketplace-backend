/**
 * @author kosiso
 * @property {String} email subscriber's email
 * @property {String} frequency subscriber's email frequency
 * @property {Array} interest subscriber's type: Blogs, Coupons, Discounts, Deals
 * @property {Array} vendors subscriber's type
 * @property {String} standing subscription status "active", "inactive", "trashed"
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

const SubscriberSchema = new Schema({
  email: { type: String },
  frequency: {
    type: String,
    enum: ["daily", "weekly", "monthly"],
    default: "weekly",
    required: [true, "Why no sender?"],
  },
  interest: { type: [] },
  vendors: [{ type: Schema.Types.ObjectId, ref: "Vendor" }],
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

SubscriberSchema.methods = {
  view(full) {
    const view = {
      id: this.id,
      email: this.email,
      frequency: this.frequency,
      interest: this.interest,
      action: this.action,
    };

    return full ? {
      ...view,
      standing: this.standing,
      updated: this.updated,
      admin: this.admin,
    } : view;
  },
};

const Subscriber = mongoose.model("Subscriber", SubscriberSchema);
export const { ObjectId } = mongoose.Types.ObjectId;
export default Subscriber;
