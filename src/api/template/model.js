/**
* @author kosiso
* @property {Object} admin  The admin's ObjectId who last modified the record
* @property {String} name template name
* @property {String} page template page(theme, home, profile, product, details,
*   invoice, ticket, newsletter, mail)
* @property {String} icon template icon
* @property {String} style template style
* @property {Array} placeholders [{attribute, value}] template placeholders
* taking property name and value
* @property {String} standing Template utilization status which can
* be "active", "inactive", "trashed"
* trashed items can be restore after a while if the system has not emptied it automatically
* @property {Date} updated date of last update
* @property {Object} admin  The admin's ObjectId who last modified the record
*/

import mongoose, { Schema } from "mongoose";
import Admin from "../admin/model";

const TemplateSchema = new Schema({
  admin: { type: Schema.Types.ObjectId, ref: "Admin" },
  name: { type: String, unique: true, required: [true, "Why no template name"] },
  page: {
    type: String,
    enum: ["notification", "theme", "home", "profile", "product", "details", "invoice", "ticket", "newsletter", "mail"],
    required: [true, "Why no page type?"],
  },
  icon: { type: String, required: [false, "Why no template image"] },
  style: { type: String, required: [true, "Why no stylesheet"] },
  placeholders: [{
    attribute: { type: String, required: [false, "Why no property name"] },
    value: { type: String, required: [false, "Why no value name"] },
  }],
  standing: { type: String, enum: ["active", "inactive", "trashed"], default: "active" },
  updated: { type: Date, default: Date.now },

}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id; },
  },
});

TemplateSchema.methods = {
  view(full) {
    const view = {
      id: this.id,
      admin: this.admin,
      name: this.name,
      page: this.page,
      icon: this.icon,
      style: this.style,
      placeholders: this.placeholders,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };

    return full ? {
      ...view,
      standing: this.standing,
      updated: this.updated,
      admin: this.admin,
    } : view;
  },
};

const Template = mongoose.model("Template", TemplateSchema);
export const { ObjectId } = mongoose.Types.ObjectId;
export default Template;
