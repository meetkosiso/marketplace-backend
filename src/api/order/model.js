/**
 * @author kosiso
 * @property {String} orderNum order number
 * @property {Object} transaction transactionID
 * @property {String} kind type of product(digital/physical)
 * @property {Object} vendor vendorID
 * @property {Object} customer customerID
 * @property {Object} coupon couponID
 * @property {Array} products [{product, quantity, sku, name, unitCost, vat}] product details
 * @property {Array} paymentDetails [{amount, currency, transaction}] payment details
 * @property {Array} shipmentDetails [{recipent, country, state, city, street, building, zip,
 *   phone, email, deliveryNote}] shipment details
 * @property {Array} trackingDetails [{company, code, standing, estimatedDelivery}] tracking details
 * @property {String} orderStatus order status(pending/paid,delivered/canceled)
 * @property {String} txHash A TxHash or transaction hash is a unique identifier
 * that is generated whenever a transaction is executed.
 * A TxHash is unique and can be used to track and trace the status of a transaction.
 * @property {String} blockNumber The number of the block in which the transaction was recorded
 * @property {String} timeStamp Duration of time since the transaction was confirmed
 * @property {String} from From The sending party of the transaction (could be from a contract)
 * @property {String} to To The receiving party of the transaction (could be a contract)
 * @property {String} value Value The value being transacted
 * @property {String} gasUsed Total transaction fee, in Ether
 * @property {String} standing order processing status "active", "inactive", "trashed"
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
import Customer from "../customer/model";
import Coupon from "../coupon/model";
import Currency from "../currency/model";
import Review from "./../review/model";

const OrderSchema = new Schema({
  orderNum: { type: String, required: [true, "Why no order number?"] },
  vendor: { type: Schema.Types.ObjectId, ref: "Vendor" },
  customer: { type: Schema.Types.ObjectId, ref: "Customer" },
  coupon: { type: Schema.Types.ObjectId, ref: "Coupon" },
  products: [{
    product: { type: Schema.Types.ObjectId, ref: "Product", required: [true, "Why no Product(s)?"] },
    quantity: { type: Number, default: 1, required: [true, "Why no Quantity?"] },
  }],
  payable: {
    amount: { type: Number, required: [false, "Why no total amount payable in USD ($)?"] },
    currency: { type: Schema.Types.ObjectId, ref: "Currency", required: [true, "Why no currency?"] },
  },
  shipmentDetails: {
    recipient: { type: String, required: [true, "Why no Shipment details?"] },
    country: { type: String, max: 50 },
    state: { type: String, max: 50 },
    city: { type: String, max: 50 },
    street: { type: String, max: 50 },
    building: { type: String, max: 50 },
    zip: { type: Number, min: 1000, max: 7777777 },
    phone: { type: String },
    email: { type: String },
    deliveryNote: { type: String, default: "Leave it at house", max: 200 },
  },
  trackingDetails: {
    company: { type: String, required: [false, "Why no Tracking Number?"] },
    code: { type: String, required: [false, "Why no Tracking Number?"] },
    standing: { type: String, enum: ["pending", "dispatched", "arrived", "delivered"] },
    estimatedDelivery: { type: Date },
  },
  orderStatus: {
    type: String,
    enum: ["pending", "paid", "delivered", "cancel"],
    default: "pending",
  },
  transaction: {
    currencyAddress: { type: String },
    nonce: { type: String },
    txHash: { type: String },
    blockNumber: { type: String },
    timeStamp: { type: String },
    from: { type: String },
    to: { type: String },
    value: { type: String },
    contractAddress: { type: String },
    input: { type: String },
    type: { type: String },
    gas: { type: String },
    gasUsed: { type: String },
    isError: { type: String },
    errCode: { type: String },
  },
  review: [{ type: Schema.Types.ObjectId, ref: "Review" }],
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

OrderSchema.index({ createdAt: 1 });

OrderSchema.methods = {
  view(full) {
    const view = {
      id: this.id,
      orderNum: this.orderNum,
      vendor: this.vendor,
      customer: this.customer,
      coupon: this.coupon,
      products: this.products,
      paymentDetails: this.paymentDetails,
      shipmentDetails: this.shipmentDetails,
      trackingDetails: this.trackingDetails,
      orderStatus: this.orderStatus,
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

const Order = mongoose.model("Order", OrderSchema);
export const { ObjectId } = mongoose.Types.ObjectId;
export default Order;
/*
TxHash
A Transaction hash is a unique identifier that is generated whenever a transaction is performed.
A TxHash can be used to track and trace the status of a transaction.

TxReceipt Status (Success, Failed)
Success - Transaction was successfully sent.
Failed - The transaction amount will be refunded after the gas fee is deducted.
The failure may be due to: Out of Gas, Bad Instruction, Canceled, ERC20 Token might have Failed

Block Height
Block height is the number of the block in which this transaction was recorded.
Block height is numbered sequentially (0, 1, 2, 3, 4, 5 and so on) beginning from
the very first block (block height 0) onwards.
The number of block confirmations is the number of blocks that have been mined and
verified by the Ethereum network since the block height of this transaction.
The greater the number of block confirmations, the more secure the transaction is considered to be.

TimeStamp
Duration of time since the transaction was recorded, and
exact date and time when the transaction was recorded.

From
Sender’s address.

To
Receiving address/contract.
If the transaction has failed, could be (Out of Gas, Bad Instruction)

Value
The value of this transaction.

Gas Limit
The maximum units of gas that may be used for this transaction.

Gas Used by Txn
The exact units of gas that was used for this transaction.

Gas Price
Cost per unit of gas specified for this transaction, in Ether and Gwei.

Actual Txn Cost/Fee
The actual cost of the transaction (Gas Used by Txn multiplied by Gas Price).
Measured in ETH. This fee is paid to the miner for computing the transaction,
regardless of whether the transaction is successful or not.

Nonce
Number of the transaction sent from the sender’s address.
Every transaction from an address is numbered sequentially,
beginning with 0 for the first transaction. For example, if the nonce
of a transaction is 10, it would be the 11th transaction sent from the sender’s address.

Input Data
Extra data recorded by the sender or contract.
*/
