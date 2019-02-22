/**
* @property {String} title  Advert title
* @property {String} content  Advert content
* @property {Object} vendor  Advert vendor
* @property {String} tag  Advert tags array of key words
* @property {Object} meta {Object} Advert analytics
* @property {String} meta.views  Advert number of views
* @property {String} meta.clicks  Advert number of views
* @property {String} standing Advert publish status "active", "inactive", "trashed"
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

const AdvertSchema = new Schema({
  vendor: { type: Schema.Types.ObjectId, ref: "Vendor", required: [true, "Why no Vendor?"] },
  title: { type: String, required: [true, "Why no Title?"] },
  content: { type: String, required: [true, "Why no Content?"] },
  tag: { type: Array, required: [true, "Why no Tag?"] },
  meta: {
    views: { type: Number, default: 1 },
    clicks: { type: Number, default: 1 },
  },
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

AdvertSchema.methods = {
  view(full) {
    const view = {
      id: this.id,
      title: this.title,
      content: this.content,
      vendor: this.vendor,
      tag: this.tag,
      updatedAt: this.updatedAt,
      createdAt: this.createdAt,
      action: this.action,
    };

    return full ? {
      ...view,
      meta: this.meta,
      updated: this.updated,
      admin: this.admin,
    } : view;
  },
};

const Advert = mongoose.model("Advert", AdvertSchema);
export const { ObjectId } = mongoose.Types.ObjectId;
export default Advert;
