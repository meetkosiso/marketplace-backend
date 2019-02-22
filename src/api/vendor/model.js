/**
* @author kosiso
* @property {Number} nonce is the vendor's authentication nonce
* @property {String} publicAddress is the vendor's MetaMask address
* @property {String} businessName is the vendor's business name
* @property {String} domainName is the vendor's unique domain name
* @property {String} email is the vendor's email address
* @property {String} password is the vendor's password
* @property {String} recoveryCode is the vendor's recovery code
* @property {String} fullname is the vendor's full name
* @property {String} username is the vendor's username
* @property {String} phone is the vendor's phone
* @property {Array} profile [{website, facebook, linkedin, instagram, skype,
*  googlePlus, twitter, youtube, pinterest]} is the vendor's social media profile
* @property {Array} address [{country, state, city, street, building, zip}] is the
* vendor's physical address
* @property {Array} preferences [{currency, language}] is the vendor's preferences
* @property {Array} frontend [{logo,banner, slogan, description, tag, theme }] is the
* vendor's frontend settings/preferences
* @property {Array} template [{home, product, productDetail,profile, blog, mail, invoice, ticket }]
* is the vendor's templates
* @property {Object} products is the vendor's products
* @property {Array} productsApproved [{accepted,rejected, defaulted }] are the vendor's
* prodcucts approeved
* @property {Number} viewCount is the number of views a vendor has
* @property {Array} lastAccess [{accessDate, ipAddress}] is the vendor's last access details
* @property {Array} account [{ completeProfile, emailVerified, domainNameSet, businessVerified}]
* is the vendor's account status
* @property {Array} notifications [{date, notice, standing}] is the vendor notifications
* @property {String} standing Vendor account status which can be "active", "inactive", "trashed"
* trashed items can be restore after a while if the system has not emptied it automatically
* @property {Date} updated is the date of last update
* @property {Boolean} onlineStatus admin's online Status
* @property {Object} admin  The admin's ObjectId who last modified the record
* @property {String} action  The admins' action on the record ["allow", "restrict", "deny"]
* allow: owner can display, transact, update, modify standing or #delete record
* restrict: owner can update, modify #delete record by cannot display or transact it
* deny: record cannot be updated, modified, display by owner and its readonly.
*/

import mongoose, { Schema } from "mongoose";
import mongoosastic from "mongoosastic";
import Admin from "../admin/model";
import Product from "./../product/model";
import Currency from "./../currency/model";
import LanguageList from "./../languageList/model";
import Template from "./../template/model";
import Review from "./../review/model";
import { randomNonce } from "./../../services/helpers";

const VendorSchema = new Schema({
  nonce: { type: Number, default: randomNonce(), required: [true, "Why no authentication nonce?"] },
  publicAddress: { type: String, max: 42, required: [false, "Why no MetaMask address?"] },
  contractAddress: { type: String, required: [false, "Why no SmartContract address?"] },
  businessName: { type: String, max: 200 },
  domainName: { type: String, unique: true, lowercase: true, max: 100, trim: true },
  email: { type: String, lowercase: true, max: 100, trim: true },
  password: { type: String, lowercase: true, trim: true },
  recoveryCode: { type: Number, default: randomNonce(), required: [false, "Why no recovery code?"] },
  fullname: { type: String, max: 200, default: "" },
  username: { type: String, default: "" },
  phone: { type: String, max: 200, default: "" },
  profile: {
    website: { type: String, max: 200, default: "" },
    facebook: { type: String, max: 200, default: "" },
    linkedin: { type: String, max: 200, default: "" },
    instagram: { type: String, max: 200, default: "" },
    skype: { type: String, max: 200, default: "" },
    googlePlus: { type: String, max: 200, default: "" },
    twitter: { type: String, max: 200, default: "" },
    youtube: { type: String, max: 200, default: "" },
    pinterest: { type: String, max: 200, default: "" },
  },
  address: {
    country: { type: String, default: "" },
    state: { type: String, default: "" },
    city: { type: String, default: "" },
    street: { type: String, default: "" },
    building: { type: String, default: "" },
    zip: { type: Number, default: "" },
    geolocation: {
      longitude: { type: Number, min: -180.0000, max: 180.0000 },
      latitude: { type: Number, min: -90.0000, max: 90.0000 },
    },
  },
  preferences: {
    currency: { type: Schema.Types.ObjectId, ref: "Currency" },
    language: { type: Schema.Types.ObjectId, ref: "LanguageList" },
  },
  frontend: {
    logo: { type: String, default: "default-vendor-logo.png" },
    banner: { type: String, default: "default-vendor-banner.png" },
    slogan: { type: String, max: 200, default: "" },
    description: { type: String, max: 200, default: "" },
    tag: { type: String, max: 200, default: "" },
    theme: { type: String, max: 200, default: "" },
  },
  templateHome: {
    layout: { type: Schema.Types.ObjectId, ref: "Template" },
    placeholders: [{ type: { type: String }, value: { type: String } }],
  },
  templateProduct: {
    layout: { type: Schema.Types.ObjectId, ref: "Template" },
    placeholders: [{ type: { type: String }, value: { type: String } }],
  },
  templateProductDetail: {
    layout: { type: Schema.Types.ObjectId, ref: "Template" },
    placeholders: [{ type: { type: String }, value: { type: String } }],
  },
  templateProfile: {
    layout: { type: Schema.Types.ObjectId, ref: "Template" },
    placeholders: [{ type: { type: String }, value: { type: String } }],
  },
  templateBlog: {
    layout: { type: Schema.Types.ObjectId, ref: "Template" },
    placeholders: [{ type: { type: String }, value: { type: String } }],
  },
  templateMail: {
    layout: { type: Schema.Types.ObjectId, ref: "Template" },
    placeholders: [{ type: { type: String }, value: { type: String } }],
  },
  templateInvoice: {
    layout: { type: Schema.Types.ObjectId, ref: "Template" },
    placeholders: [{ type: { type: String }, value: { type: String } }],
  },
  templateTicket: {
    layout: { type: Schema.Types.ObjectId, ref: "Template" },
    placeholders: [{ type: { type: String }, value: { type: String } }],
  },
  templateChat: {
    layout: { type: Schema.Types.ObjectId, ref: "Template" },
    placeholders: [{ type: { type: String }, value: { type: String } }],
  },
  products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  productsApproved: {
    accepted: { type: Number, default: 0 },
    rejected: { type: Number, default: 0 },
    defaulted: { type: Number, default: 0 },
  },
  viewCount: { type: Number, default: 1 },
  lastAccess: [{
    accessDate: { type: Date },
    ipAddress: { type: String, min: 15, max: 45 },
  }],
  completeProfile: { type: Boolean, default: false },
  emailVerified: { type: Boolean, default: false },
  domainNameSet: { type: Boolean, default: false },
  businessVerified: { type: Boolean, default: false },
  paymentActivation: { type: Boolean, default: false },
  activationDate: { type: Date },
  approval: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
  approvedBy: { type: Schema.Types.ObjectId, ref: "Admin" },
  comment: { type: String },
  notifications: [{
    date: { type: Date, default: Date.now },
    notice: { type: String, max: 2000 },
    standing: { type: String, enum: ["unread", "read", "trashed"], default: "unread" },
  }],
  review: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  googleAnalytics: {
    trackingId: { type: String, default: "" },
  },
  standing: { type: String, enum: ["active", "inactive", "trashed"], default: "active" },
  onlineStatus: { type: Boolean, default: false },
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

VendorSchema.index({ createdAt: 1 });

VendorSchema.methods = {
  view(full) {
    const view = {
      id: this.id,
      fullname: this.fullname,
      email: this.email,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      action: this.action,
    };

    return full ? {
      ...view,
      // add prpoerties for a full view
      nonce: this.nonce,
      publicAddress: this.publicAddress,
      businessName: this.businessName,
      domainName: this.domainName,
      password: this.password,
      username: this.username,
      recoveryCode: this.recoveryCode,
      phone: this.phone,
      profile: this.profile,
      address: this.address,
      preferences: this.preferences,
      frontend: this.frontend,
      template: this.template,
      products: this.products,
      viewCount: this.viewCount,
      lastAccess: this.lastAccess,
      account: this.account,
      notifications: this.notifications,
      standing: this.standing,
      onlineStatus: this.onlineStatus,
      updated: this.updated,
      admin: this.admin,
    } : view;
  },
};

// Virtual for Vendor's URL
VendorSchema
  .virtual("url")
  .get(function () {
    if (this.domainNameSet) return `https://${this.domainName}.bezop.com`;
    return "https://default-shop.bezop.com";
  });

VendorSchema.plugin(mongoosastic, {
  host: process.env.ELASTICSEARCH_URL,
  port: process.env.ELASTICSEARCH_PORT,
});

const Vendor = mongoose.model("Vendor", VendorSchema);
export const { ObjectId } = mongoose.Types.ObjectId;
export default Vendor;
