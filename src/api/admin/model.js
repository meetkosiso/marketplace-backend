/**
 * @description only one admin can be super. Only the super can appoint masters.
 * Only super and masters have overall privileges.
 * After signup with metamask, Acc action is restricted, standing is inactive but allows for update
 * After update, if all required fields are entered, the account standing is active
 * After Super Admin's approval, action is allowed and admin can perform her role
 * For Valid Admin, action="allow", standing="active"
 * @property {Number} nonce  authentication nonce generated every time
 * @property {String} publicAddress  Metamask public address
 * @property {String} username admin's username
 * @property {String} role  admin's role: "super", "master", "support", "finance", "technical".
 * Super Admin is the first and only one who appoint and modify masters.
 * Masters Admin have overall privilege. They can appoint other admins but not as masters.
 * Finance Admin deals with approving vendors, tracking payments and order deliveries.
 * Support Admin deals with arbitration and support tickets from Vendors.
 * Technical Admins are programmers dealing with Software Maintenance and Upgrade issues
 * @property {Array} lastAccess [{accessDate, ipAddress}] admin's last login/access
 * @property {String} fullname admin's first and last name
 * @property {String} phone admin's phone number
 * @property {String} address admin's physical address
 * @property {String} email admin's email address
 * @property {Array} notifications [{date, notice, standing}] admin's notifications
 * @property {String} standing admin's status
 * @property {Boolean} onlineStatus admin's online Status
 * @property {Date} updated update date
 * @property {String} updatedBy Admin Id of staff (Super or Master Admin) who updated the record
 */


import mongoose, { Schema } from "mongoose";
import { randomNonce } from "./../../services/helpers";

const AdminSchema = new Schema({
  nonce: { type: Number, default: randomNonce(), required: [true, "Why no authentication nonce?"] },
  publicAddress: { type: String, max: 42, required: [false, "Why no MetaMask address?"] },
  username: { type: String, default: "" },
  role: { type: String, enum: ["super", "master", "support", "finance", "technical"], default: "support" },
  lastAccess: [{
    accessDate: { type: Date },
    ipAddress: { type: String, min: 15, max: 45 },
  }],
  fullname: { type: String, default: "" },
  phone: { type: String, default: "" },
  address: { type: String, default: "" },
  email: { type: String, lowercase: true, max: 100, trim: true },
  password: { type: String },
  recoveryCode: { type: Number, default: randomNonce(), required: [false, "Why no recovery code?"] },
  completeProfile: { type: Boolean, default: false },
  notifications: [{
    date: { type: Date, default: Date.now },
    notice: { type: String, max: 2000 },
    standing: { type: String, enum: ["unread", "read", "trashed"], default: "unread" },
  }],
  onlineStatus: { type: Boolean, default: false },
  standing: { type: String, enum: ["active", "inactive", "trashed"], default: "inactive" },
  updated: { type: Date, default: Date.now },
  action: { type: String, enum: ["allow", "restrict", "deny"], default: "allow" },
  updatedBy: { type: String },

}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id; },
  },
});

AdminSchema.methods = {
  view(full) {
    const view = {
      // simple view
      id: this.id,
      nonce: this.nonce,
      publicAddress: this.publicAddress,
      username: this.username,
      role: this.role,
      lastAccess: this.lastAccess,
      fullname: this.fullname,
      phone: this.phone,
      address: this.address,
      email: this.email,
      notifications: this.notifications,
      onlineStatus: this.onlineStatus,
      standing: this.standing,
      updated: this.updated,
    };

    return full ? {
      ...view,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      updatedBy: this.updatedBy,
    } : view;
  },
};
const Admin = mongoose.model("Admin", AdminSchema);

export const { ObjectId } = mongoose.Types.ObjectId;
export default Admin;
