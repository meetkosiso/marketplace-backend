/**
* @author kosiso
* @property {Object} admin adminID
* @property {Number} phraseId translated phrase number
* @property {String} phrase translated phrase
* @property {String} english English translation
* @property {String} french French translation
* @property {String} spanish Spanish translation
* @property {String} bangla Bangla translation
* @property {String} arabic Arabic translation
* @property {String} chinese Chinese translation
* @property {String} standing word status "active", "inactive", "trashed"
* trashed items can be restore after a while if the system has not emptied it automatically
* @property {Date} updated date of last update
*/

import mongoose, { Schema } from "mongoose";
import Admin from "../vendor/model";

const LanguageSchema = new Schema({
  admin: { type: Schema.Types.ObjectId, ref: "Admin" },
  phraseId: { type: Number },
  phrase: { type: String, required: [true, "Why no phrase key?"] },
  english: { type: String, required: [true, "Why no english?"] },
  french: { type: String, required: [true, "Why no french?"] },
  spanish: { type: String, required: [true, "Why no spanish?"] },
  bangla: { type: String, required: [true, "Why no bangla?"] },
  arabic: { type: String, required: [true, "Why no arabic?"] },
  chinese: { type: String, required: [true, "Why no chinese?"] },
  standing: { type: String, enum: ["active", "inactive", "trashed"], default: "active" },
  updated: { type: Date, default: Date.now },
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id; },
  },
});

LanguageSchema.methods = {
  view(full) {
    const view = {
      id: this.id,
      phraseId: this.phraseId,
      phrase: this.phrase,
      english: this.english,
      french: this.french,
      spanish: this.spanish,
      bangla: this.bangla,
      arabic: this.arabic,
      chinese: this.chinese,
      updatedAt: this.updatedAt,
      createdAt: this.createdAt,
    };

    return full ? {
      ...view,
      updated: this.updated,
      standing: this.standing,
      admin: this.admin,
    } : view;
  },
};

const Language = mongoose.model("Language", LanguageSchema);
export const { ObjectId } = mongoose.Types.ObjectId;
export default Language;
