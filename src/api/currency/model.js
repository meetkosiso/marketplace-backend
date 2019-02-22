/**
* @author kosiso
* @property {Object} admin adminId that created currency
* @property {String} name currency name
* @property {String} code currency code
* @property {String} description currency description
* @property {String} kind type of currency (digital/fiat)
* @property {String} symbol currency symbol
* @property {String} currencyAddress standard id of the currency
* @property {Number} exchange currency exchange rate
* @property {String} icon currency icon
* @property {Number} viewCount number of view counts
* @property {String} standing status of currency "active", "inactive", "trashed"
* trashed items can be restore after a while if the system has not emptied it automatically
* @property {Date} updated date of last update
* @property {Object} admin  The admin's ObjectId who last modified the record
*/

import mongoose, { Schema } from "mongoose";
import Admin from "../vendor/model";

const CurrencySchema = new mongoose.Schema({
  admin: { type: Schema.Types.ObjectId, ref: "Admin" },
  name: { type: String, required: [true, "Why no name?"] },
  code: { type: String, unique: true, required: [true, "Why no code?"] },
  description: { type: String },
  kind: { type: String, enum: ["digital", "fiat"], required: [true, "Why no currency type?"] },
  symbol: { type: String, required: [true, "Why no symbol?"] },
  currencyAddress: { type: String, required: [false, "Why no currency standard Id?"] },
  exchange: { type: Number, required: [true, "Why no dollar-based exchange rate?"] },
  icon: { type: String, default: "default-currency-icon.png" },
  viewCount: { type: Number, default: 1 },
  standing: { type: String, enum: ["active", "inactive", "trashed"], default: "inactive" },
  updated: { type: Date, default: Date.now },
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id; },
  },
});

CurrencySchema.methods = {
  view(full) {
    const view = {
      id: this.id,
      name: this.name,
      code: this.code,
      description: this.description,
      kind: this.kind,
      symbol: this.symbol,
      currencyAddress: this.currencyAddress,
      exchange: this.exchange,
      icon: this.icon,
    };

    return full ? {
      ...view,
      admin: this.admin,
      updated: this.updated,
      standing: this.standing,
    } : view;
  },
};

const Currency = mongoose.model("Currency", CurrencySchema);
export const { ObjectId } = mongoose.Types.ObjectId;
export default Currency;
