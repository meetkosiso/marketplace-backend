/**
* @author kosiso
* @property {String} name Collection's name or title
* @property {String} description  collection description
* @property {String} kind  collection type (digital/physical)
* @property {String} icon  collection icon
* @property {String} banner  collection banner
* @property {String} parent  parent collection
* @property {String} standing  status of collection "active", "inactive", "trashed"
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

const collectionSchema = new Schema({
  name: { type: String, required: [true, "Why no name?"], unique: true },
  description: { type: String, required: [true, "Why no description?"] },
  kind: { type: String, enum: ["digital", "physical"], required: [true, "Why no collection type?"] },
  icon: { type: String, required: [false, "Why no icon?"] },
  banner: { type: String, required: [false, "Why no banner?"] },
  parent: { type: String, default: "0" },
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


collectionSchema.methods = {
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
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
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

const model = mongoose.model("Collection", collectionSchema);

export const { schema } = model.schema;
export const { ObjectId } = mongoose.Types.ObjectId;
export default model;
