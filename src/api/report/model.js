/**
* @author kosiso
* @property {String} code reports code
* @property {String} name report name
* @property {String} description reports description
* @property {String} standing reports status "active", "inactive", "trashed"
* trashed items can be restore after a while if the system has not emptied it automatically
* @property {Date} updated date of last update
* @property {Object} admin  The admin's ObjectId who last modified the record
*/

import mongoose, { Schema } from "mongoose";
import Admin from "../admin/model";

const reportSchema = new Schema({
  admin: { type: Schema.Types.ObjectId, ref: "Admin" },
  code: { type: String, index: true, unique: true, required: [true, "Why no reports code?"] },
  name: { type: String, unique: true, required: [true, "Why no reports name?"] },
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

reportSchema.methods = {
  view(full) {
    const view = {
      id: this.id,
      code: this.code,
      name: this.name,
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

const report = mongoose.model("report", reportSchema);

export const { ObjectId } = mongoose.Types.ObjectId;
export default report;
