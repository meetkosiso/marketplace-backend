/**
* @author kosiso
* @property {String} code transactions code
* @property {String} kind type of transactions(system, operations)
* It defines whether the transactions affects the Software or the running operations.
* @property {String} scope transaction scope defines the users affected. That is,
* is it for all users (user), or only for vendors, customers, and admins?
* @property {String} name transaction name
* @property {String} value value of transactions
* @property {String} description transactions description
* @property {String} standing transactions status "active", "inactive", "trashed"
* trashed items can be restore after a while if the system has not emptied it automatically
* @property {Date} updated date of last update
* @property {Object} admin  The admin's ObjectId who last modified the record
*/

import mongoose, { Schema } from "mongoose";
import Admin from "../admin/model";
import Vendor from "../vendor/model";
import Customer from "../customer/model";

const TransactionSchema = new Schema({
  admin: { type: Schema.Types.ObjectId, ref: "Admin" },
  vendor: { type: Schema.Types.ObjectId, ref: "Vendor" },
  customer: { type: Schema.Types.ObjectId, ref: "Customer" },
  subject: { type: String, enum: ["customer", "vendor", "admin"], required: [true, "Why no type?"] },
  code: { type: String, index: { unique: true }, required: [true, "Why no transactions code?"] },
  transactionHash: { type: String, required: [true, "Why no transactions hash?"] },
  gas: { type: String, required: [true, "Why no transactions value?"] },
  value: { type: String, required: [true, "Why no transactions value?"] },
  currency: { type: String, required: [true, "Why no transactions value?"] },
  description: { type: String, required: [true, "Why no description?"] },

}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id; },
  },
});


TransactionSchema.methods = {
  view(full) {
    const view = {
      id: this.id,
      code: this.code,
      admin: this.admin,
      vendor: this.vendor,
      customer: this.customer,
      subject: this.subject,
      transactionHash: this.transactionHash,
      value: this.value,
      gas: this.gas,
      currency: this.currency,
      description: this.description,
      createdAt: this.createdAt,
    };

    return full ? {
      ...view,
      updatedAt: this.updatedAt,
    } : view;
  },
};

const Transaction = mongoose.model("Transaction", TransactionSchema);

export const { ObjectId } = mongoose.Types.ObjectId;
export default Transaction;
