/**
 * @author kosiso
 * @description Multimedia files that cut across every vendor page
 * It adds to the design on the page look and feel
 * @property {String} mediaType type of media
 * @property {Object} vendor vendorID
 * @property {String} purpose media purpose(slide/picture/banner/background)
 * @property {Array} page [{product, stock, vendor, brand, category, blog}] pages to display media
 * @property {String} place media location
 * @property {String} num media number
 * @property {String} url media url
 * @property {String} title media title
 * @property {String} description media description
 * @property {String} style media style
 * @property {String} standing media display status "active", "inactive", "trashed"
* trashed items can be restore after a while if the system has not emptied it automatically
 * @property {Date} updated last update date
 * @property {Object} admin  The admin's ObjectId who last modified the record
 * @property {String} action  The admins' action on the record ["allow", "restrict", "deny"]
 * allow: owner can display, transact, update, modify standing or #delete record
 * restrict: owner can update, modify #delete record by cannot display or transact it
 * deny: record cannot be updated, modified, display by owner and its readonly.
*/

import mongoose, { Schema } from "mongoose";
import Admin from "../admin/model";
import Vendor from "../vendor/model";

const MediaSchema = new Schema({
  mediaType: { type: String, required: [true, "Why no media type?"] },
  vendor: { type: Schema.Types.ObjectId, ref: "Vendor" },
  purpose: {
    type: String,
    enum: ["slide", "picture", "banner", "background"],
    required: [true, "Why no purpose?"],
  },
  page: {
    product: { type: Boolean, default: true },
    stock: { type: Boolean, default: true },
    vendor: { type: Boolean, default: true },
    brand: { type: Boolean, default: true },
    category: { type: Boolean, default: true },
    blog: { type: Boolean, default: true },
  },
  place: { type: String, required: [true, "Why no place?"] },
  num: { type: String, required: [true, "Why no num?"] },
  url: { type: String, required: [true, "Why no url?"] },
  title: { type: String, required: [true, "Why no title?"] },
  description: { type: String, required: [true, "Why no description?"] },
  style: { type: String, required: [true, "Why no style?"] },
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

MediaSchema.methods = {
  view(full) {
    const view = {
      id: this.id,
      mediaType: this.mediaType,
      vendor: this.vendor,
      purpose: this.purpose,
      page: this.page,
      place: this.place,
      num: this.num,
      url: this.url,
      title: this.title,
      description: this.description,
      style: this.style,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
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

const Media = mongoose.model("Media", MediaSchema);
export const { ObjectId } = mongoose.Types.ObjectId;
export default Media;
