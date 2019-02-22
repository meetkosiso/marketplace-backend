/**
* @author kosiso
* @property {Object} admin adminID
* @property {String} name language name
* @property {String} dbField language table field
* @property {String} icon language icon
* @property {String} standing language status "active", "inactive", "trashed"
* trashed items can be restore after a while if the system has not emptied it automatically
* @property {Date} updated date of last update
*/

import mongoose, { Schema } from "mongoose";
import Admin from "../vendor/model";

const LanguageListSchema = new Schema({
  admin: { type: Schema.Types.ObjectId, ref: "Admin" },
  name: { type: String, required: [true, "Why no name?"] },
  dbField: { type: String, required: [true, "Why no langauge table field name?"] },
  icon: { type: String, required: [false, "Why no image?"] },
  standing: { type: String, enum: ["active", "inactive", "trashed"], default: "active" },
  updated: { type: Date, default: Date.now },
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id; },
  },
});

LanguageListSchema.methods = {
  view(full) {
    const view = {
      id: this.id,
      name: this.name,
      dbField: this.dbField,
      icon: this.icon,
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

const LanguageList = mongoose.model("LanguageList", LanguageListSchema);
export const { ObjectId } = mongoose.Types.ObjectId;
export default LanguageList;
