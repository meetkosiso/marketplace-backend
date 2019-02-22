/**
* @property {String} name Brand name or title
* @property {String} description Brand description
* @property {String} icon Brand icon
* @property {String} banner Brand banner display image
* @property {Object} vendor Vendor who created brand
* @property {Number} viewCount Number of views
* @property {String} standing Brand status "active", "inactive", "trashed"
* trashed items can be restore after a while if the system has not emptied it automatically
* @property {Date}  updated Date of last update by vendor (not admin)
* @property {Object} admin  The admin's ObjectId who last modified the record
* @property {String} action  The admins' action on the record ["allow", "restrict", "deny"]
* allow: owner can display, transact, update, modify standing or #delete record
* restrict: owner can update, modify #delete record by cannot display or transact it
* deny: record cannot be updated, modified, display by owner and its readonly.
*/

import mongoose, { Schema } from "mongoose";
import mongoosastic from "mongoosastic";
import Admin from "../admin/model";
import Review from "./../review/model";

const BrandSchema = new Schema({
  name: { type: String, required: [true, "Why no name?"], es_indexed: true },
  description: { type: String, required: [true, "Why no description?"] },
  icon: { type: String, required: [false, "Why no logo?"], es_indexed: true },
  banner: { type: String, required: [false, "Why no banner?"] },
  vendor: { type: Schema.Types.ObjectId, ref: "Vendor", required: [true, "Why no Vendor?"], es_indexed: true },
  review: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  viewCount: { type: Number, default: 1 },
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

BrandSchema.methods = {
  view(full) {
    const view = {
      // simple view
      id: this.id,
      name: this.name,
      description: this.description,
      icon: this.icon,
      banner: this.banner,
      vendor: this.vendor,
      review: this.review,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      action: this.action,
    };

    return full ? {
      ...view,
      view_count: this.view_count,
      standing: this.standing,
      updated: this.updated,
      admin: this.admin,
    } : view;
  },
};

BrandSchema.plugin(mongoosastic, {
  host: process.env.ELASTICSEARCH_URL,
  port: process.env.ELASTICSEARCH_PORT,
  hydrate: true,
  hydrateOptions: { lean: true },
});

const Brand = mongoose.model("Brand", BrandSchema);
export const { ObjectId } = mongoose.Types.ObjectId;
export default Brand;
