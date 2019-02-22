/**
* @author kosiso
* @property {String} createdType type of mail
* @property {String} createdBy userId of the user(admin/vendor) who created the mail
* @property {String} name name of mail
* @property {String} kind kind of mail(notification/newsletter/advert)
* @property {String} language mail language
* @property {String} mailSubject mail subject
* @property {String} mailBody mail content
* @property {String} recipient mail recipent(vendor/customer/subscriber)
* @property {String} standing mail utilization status "active", "inactive", "trashed"
* trashed items can be restore after a while if the system has not emptied it automatically
* @property {Date} updated date of mail last update
*/

import mongoose, { Schema } from "mongoose";
import Admin from "../vendor/model";
import LanguageList from "../languageList/model";

const MailSchema = new Schema({
  admin: { type: Schema.Types.ObjectId, ref: "Admin" },
  createdType: { type: String, enum: ["vendor", "admin"], required: [true, "Why no created type?"] },
  createdBy: { type: String, required: [true, "Why no created by?"] },
  name: { type: String, required: [true, "Why no name?"] },
  kind: { type: String, enum: ["notification", "newsletter", "advert"], required: [true, "Why no mail type?"] },
  language: { type: Schema.Types.ObjectId, ref: "LanguageList", required: [false, "Why no mail language?"] },
  mailSubject: { type: String, required: [true, "Why no mail subject?"] },
  mailBody: { type: String, required: [true, "Why no mail body?"] },
  recipient: { type: String, enum: ["vendor", "customer", "subscriber"], required: [true, "Why no recipient type?"] },
  standing: { type: String, enum: ["active", "inactive", "trashed"], default: "active" },
  updated: { type: Date, default: Date.now },
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transfrom: (obj, ret) => { delete ret._id; },
  },
});

MailSchema.methods = {
  view(full) {
    const view = {
      id: this.id,
      name: this.name,
      kind: this.kind,
      language: this.language,
      mailSubject: this.mailSubject,
      mailBody: this.mailBody,
      recipient: this.recipient,
      createdType: this.createdType,
      createdBy: this.createdBy,
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

const Mail = mongoose.model("Mail", MailSchema);
export const { ObjectId } = mongoose.Types.ObjectId;
export default Mail;
