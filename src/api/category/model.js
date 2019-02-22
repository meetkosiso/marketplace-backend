/**
* @property {String} name Category's name or title
* @property {String} description  category description
* @property {String} kind  category type (digital/physical)
* @property {String} icon  category icon
* @property {String} banner  category banner
* @property {String} parent  parent category
* @property {Object} vendor  vendor that created category
* @property {Number} viewCount  number of views
* @property {String} standing  status of category "active", "inactive", "trashed"
* trashed items can be restore after a while if the system has not emptied it automatically
* @property {Date} updated date of last update
* @property {Object} admin  The admin's ObjectId who last modified the record
* @property {String} action  The admins' action on the record ["allow", "restrict", "deny"]
* allow: owner can display, transact, update, modify standing or #delete record
* restrict: owner can update, modify #delete record by cannot display or transact it
* deny: record cannot be updated, modified, display by owner and its readonly.
*/

import mongoose, { Schema } from "mongoose";
import mongoosastic from "mongoosastic";
import Admin from "../admin/model";
import Product from "../product/model";
// import Collection from "../collection/model";
import Vendor from "../vendor";
import Review from "./../review/model";

const CategorySchema = new Schema({
  collections: { type: Schema.Types.ObjectId, ref: "Collection", required: [true, "Why no collection?"], es_indexed: true },
  name: { type: String, required: [true, "Why no name?"], es_indexed: true },
  description: { type: String, required: [true, "Why no description?"] },
  kind: { type: String, enum: ["digital", "physical"], required: [true, "Why no kind?"], es_indexed: true },
  icon: { type: String, required: [false, "Why no icon?"], es_indexed: true },
  banner: { type: String, required: [false, "Why no banner?"], es_indexed: true },
  parent: { type: String, default: "0" },
  vendor: { type: Schema.Types.ObjectId, ref: "Vendor" },
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


CategorySchema.methods = {
  view(full) {
    const view = {
      // simple view
      id: this.id,
      name: this.name,
      description: this.description,
      kind: this.kind,
      icon: this.icon,
      banner: this.banner,
      parent: this.parent,
      products: this.products,
      vendor: this.vendor,
      review: this.review,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      action: this.action,
    };

    return full ? {
      ...view,
      viewCount: this.viewCount,
      standing: this.standing,
      updated: this.updated,
      admin: this.admin,
    } : view;
  },
};

CategorySchema.plugin(mongoosastic, {
  host: process.env.ELASTICSEARCH_URL,
  port: process.env.ELASTICSEARCH_PORT,
  hydrate: true,
  hydrateOptions: { lean: true },
});

const model = mongoose.model("Category", CategorySchema);

export const { schema } = model.schema;
export const { ObjectId } = mongoose.Types.ObjectId;
export default model;
