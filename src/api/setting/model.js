/**
* @author kosiso
* @property {String} code settings code
* @property {String} kind type of settings(system, operations)
* It defines whether the settings affects the Software or the running operations.
* @property {String} scope setting scope defines the users affected. That is,
* is it for all users (user), or only for vendors, customers, and admins?
* @property {String} name setting name
* @property {String} value value of settings
* @property {String} description settings description
* @property {String} standing settings status "active", "inactive", "trashed"
* trashed items can be restore after a while if the system has not emptied it automatically
* @property {Date} updated date of last update
* @property {Object} admin  The admin's ObjectId who last modified the record
*/

import mongoose, { Schema } from "mongoose";
import Admin from "../admin/model";

const SettingSchema = new Schema({
  admin: { type: Schema.Types.ObjectId, ref: "Admin" },
  code: { type: String, index: { unique: true }, required: [true, "Why no settings code?"] },
  kind: {
    type: String,
    enum: ["system", "operations"],
    required: [true, "Why no type?"],
  },
  scope: {
    type: String,
    enum: ["global", "customer", "vendor", "admin", "anonymous"],
    required: [true, "Why no type?"],
  },
  name: { type: String, required: [true, "Why no settings name?"] },
  value: { type: String, required: [true, "Why no settings value?"] },
  description: { type: String, required: [true, "Why no description?"] },
  standing: { type: String, enum: ["active", "inactive", "trashed"], default: "active" },
  updated: { type: Date, default: Date.now },

}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id; },
  },
});


SettingSchema.methods = {
  view(full) {
    const view = {
      id: this.id,
      code: this.code,
      kind: this.kind,
      name: this.name,
      value: this.value,
      description: this.description,
      standing: this.standing,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };

    return full ? {
      ...view,
      updated: this.updated,
      admin: this.admin,
    } : view;
  },
};

const Setting = mongoose.model("Setting", SettingSchema);

export const { ObjectId } = mongoose.Types.ObjectId;
export default Setting;
