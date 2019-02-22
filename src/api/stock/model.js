/**
 * @author kosiso
 * @property {Schema.Types.ObjectId} vendor vendorID
 * @property {Schema.Types.ObjectId} product productId
 * @property {String} orderNum stock number
 * @property {String} kind type of stock(addition/subtraction)
 * @property {Number} quantity stock of quantity
 * @property {Number} available availabilty number
 * @property {Number} unitCost unit cost of products
 * @property {Number} unitPrice unit price of products
 * @property {String} description stock description
 * @property {String} standing stock processing status "active", "inactive", "trashed"
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
import Product from "../product/model";
import Vendor from "../vendor/model";

const StockSchema = new Schema({
  vendor: { type: Schema.Types.ObjectId, ref: "Vendor" },
  product: { type: Schema.Types.ObjectId, ref: "Product" },
  orderNum: { type: String, required: [true, "Why no order number?"] },
  kind: { type: String, enum: ["addition", "subtraction"], required: [true, "Why no kind (addition or subtraction)?"] },
  quantity: { type: Number, required: [true, "Why no quantity?"] },
  available: { type: Number, default: 0 },
  unitCost: { type: Number, required: [false, "Why no unit cost?"] },
  unitPrice: { type: Number, required: [false, "Why no unit price?"] },
  description: { type: String, required: [true, "Why no description?"] },
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


StockSchema.index({ createdAt: 1 });

StockSchema.methods = {
  view(full) {
    const view = {
      id: this.id,
      vendor: this.vendor,
      product: this.product,
      orderNum: this.orderNum,
      kind: this.kind,
      quantity: this.quantity,
      available: this.available,
      unitCost: this.unitCost,
      unitPrice: this.unitPrice,
      description: this.description,
      standing: this.standing,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      action: this.action,
    };

    return full ? {
      ...view,
      updated: this.updated,
      admin: this.admin,
    } : view;
  },
};

const Stock = mongoose.model("Stock", StockSchema);
export const { ObjectId } = mongoose.Types.ObjectId;
export default Stock;
