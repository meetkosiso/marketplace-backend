/**
 * @author kosiso
 * @property {String} name name of slider
 * @property {Object} vendor vendorID
 * @property {String} kind slider type(image/text)
 * @property {Array} page [{product, brand, category, blog}] page slider will appear
 * @property {String} place slider location
 * @property {Array} elements [{element[{active, image, position, title, subtitle}]}]
 * slider elements/properties
 * @property {Array} style [{title, subtitle, image, background, color}] slider style
 * @property {String} standing slider status "active", "inactive", "trashed"
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

const SliderSchema = new Schema({
  name: { type: String, required: [true, "Why no slider name?"] },
  vendor: { type: Schema.Types.ObjectId, ref: "Vendor" },
  kind: { type: String, enum: ["image", "text"], required: [true, "Why no Slider type?"] },
  page: {
    product: { type: Boolean, default: false },
    brand: { type: Boolean, default: false },
    category: { type: Boolean, default: false },
    blog: { type: Boolean, default: false },
  },
  place: { type: String, enum: ["top", "middle", "bottom"], default: "top", required: [true, "Why no Slider location?"] },
  elements: {
    element0: {
      active: { type: Boolean, default: false },
      image: { type: String },
      position: { type: Number, default: 0 },
      title: { type: String, required: [false, "Why no title?"] },
      subtitle: { type: String, required: [false, "Why no subtitle?"] },
    },
    element1: {
      active: { type: Boolean, default: false },
      image: { type: String },
      position: { type: Number, default: 1 },
      title: { type: String, required: [false, "Why no title?"] },
      subtitle: { type: String, required: [false, "Why no subtitle?"] },
    },
    element2: {
      active: { type: Boolean, default: false },
      image: { type: String },
      position: { type: Number, default: 2 },
      title: { type: String, required: [false, "Why no title?"] },
      subtitle: { type: String, required: [false, "Why no subtitle?"] },
    },
    element3: {
      active: { type: Boolean, default: false },
      image: { type: String },
      position: { type: Number, default: 3 },
      title: { type: String, required: [false, "Why no title?"] },
      subtitle: { type: String, required: [false, "Why no subtitle?"] },
    },
    element4: {
      active: { type: Boolean, default: false },
      image: { type: String },
      position: { type: Number, default: 4 },
      title: { type: String, required: [false, "Why no title?"] },
      subtitle: { type: String, required: [false, "Why no subtitle?"] },
    },
    element5: {
      active: { type: Boolean, default: false },
      image: { type: String },
      position: { type: Number, default: 5 },
      title: { type: String, required: [false, "Why no title?"] },
      subtitle: { type: String, required: [false, "Why no subtitle?"] },
    },
    element6: {
      active: { type: Boolean, default: false },
      image: { type: String },
      position: { type: Number, default: 6 },
      title: { type: String, required: [false, "Why no title?"] },
      subtitle: { type: String, required: [false, "Why no subtitle?"] },
    },
    element7: {
      active: { type: Boolean, default: false },
      image: { type: String },
      position: { type: Number, default: 7 },
      title: { type: String, required: [false, "Why no title?"] },
      subtitle: { type: String, required: [false, "Why no subtitle?"] },
    },
    element8: {
      active: { type: Boolean, default: false },
      image: { type: String },
      position: { type: Number, default: 8 },
      title: { type: String, required: [false, "Why no title?"] },
      subtitle: { type: String, required: [false, "Why no subtitle?"] },
    },
    element9: {
      active: { type: Boolean, default: false },
      image: { type: String },
      position: { type: Number, default: 9 },
      title: { type: String, required: [false, "Why no title?"] },
      subtitle: { type: String, required: [false, "Why no subtitle?"] },
    },
  },
  style: {
    title: { type: String },
    subtitle: { type: String },
    image: { type: String },
    background: { type: String, default: "transparent" },
    color: { type: String, default: "black" },
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

SliderSchema.methods = {
  view(full) {
    const view = {
      id: this.id,
      name: this.name,
      vendor: this.vendor,
      kind: this.kind,
      elements: this.elements,
      page: this.page,
      place: this.place,
      title: this.title,
      subtitle: this.subtitle,
      style: this.style,
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

const Slider = mongoose.model("Slider", SliderSchema);
export const { ObjectId } = mongoose.Types.ObjectId;
export default Slider;
