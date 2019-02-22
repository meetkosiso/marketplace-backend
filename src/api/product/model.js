/**
 * @author kosiso
 * @description Currency is infered from the vendor currency preferences for all vendor products
 * Products with the same parent names are siblings or varaity options
 * @property {String} code product code
 * @property {String} sku product sku
 * @property {String} upc product upc
 * @property {String} name name of product
 * @property {Schema.Types.ObjectId} vendor vendorID that created product
 * @property {Array} category [{main, sub}] product category
 * @property {Schema.Types.ObjectId} brand brandID
 * @property {Array} description [{color, unit, long, short, tag}] product description
 * @property {Array} variety [{options, parent}] product variety
 * @property {Array} price [{deal, valuation, unitPrice, costPrice, slashPrice,
 *  discount, discountType, tax, taxType}]
 * @property {Array} images [{image_sm, image_md, image_lg, image_front, image_back,
 *  image_top, image_bottom, image_right,
 * image_left, icon}] product images
 * @property {Array} shippingDetails [{cost, weight, length, width, height}] shipping details
 * @property {Array} manufactureDetails [{make, model, releaseDate}] manufacturing details
 * @property {Array} download [{downloadable, downloadName}] download details
 * @property {Number} available [{name, value}] extra fields
 * @property {Array} extraFields [{name, value}] extra fields
 * @property {Array} approval [{approved, approvedBy, approvedById, comment}] approval details
 * @property {Array} analytics [{feature, viewDate, viewCount }]
 * @property {String} standing product display status "active", "inactive", "trashed"
 * trashed items can be restore after a while if the system has not emptied it automatically
 * @property {Date} updated last update date
 * @property {Boolean} action product action by admin, default is true. When false,
 *  product cannot be updated
 * @property {Object} admin  The admin's ObjectId who last modified the record
 * @property {String} action  The admins' action on the record ["allow", "restrict", "deny"]
 * allow: owner can display, transact, update, modify standing or #delete record
 * restrict: owner can update, modify #delete record by cannot display or transact it
 * deny: record cannot be updated, modified, display by owner and its readonly.
*/

import mongoose, { Schema } from "mongoose";
import mongoosastic from "mongoosastic";
import Admin from "../admin/model";
import Category from "../category/model";
import Collection from "../collection/model";
import Vendor from "../vendor/model";
import Brand from "../brand/model";
import Review from "./../review/model";
import Approval from "./../approval/model";
import { randomNum } from "./../../services/helpers";


const ProductSchema = new Schema({
  code: { type: String, unique: true, required: [true, "Why no Code?"], default: randomNum() },
  sku: { type: String, required: [false, "Why no Sku?"], max: 50 },
  upc: { type: String, required: [false, "Why no Upc?"], max: 50 },
  name: { type: String, required: [true, "Why no Product name?"], max: 200 },
  vendor: {
    type: Schema.Types.ObjectId,
    ref: "Vendor",
    es_type: "nested",
    es_include_in_parent: true,
    required: [true, "Why no vendor?"],
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    es_type: "nested",
    es_include_in_parent: true,

    es_select: "id name icon",
    required: [true, "Why no category?"],
  },
  collections: {
    type: Schema.Types.ObjectId,
    ref: "Collection",
    es_type: "nested",
    es_include_in_parent: true,
    es_select: "id name icon",
    required: [true, "Why no Collection?"],
  },
  brand: {
    type: Schema.Types.ObjectId,
    ref: "Brand",
    es_type: "nested",
    es_include_in_parent: true,
    es_select: "id name icon",
  },
  descriptionColor: { type: Array, default: [] },
  descriptionUnit: { type: String, default: "" },
  descriptionLong: { type: String, required: [true, "Why no Description?"], max: 5000 },
  descriptionShort: { type: String, required: [true, "Why no Short description?"], max: 500 },
  descriptionTag: { type: Array, default: [] },
  variety: {
    options: { type: Boolean, default: false },
    parent: { type: String, default: "" },
  },
  price: {
    deal: { type: Boolean, required: [false, "Why no Deal?"], default: false },
    valuation: { type: String, enum: ["FIFO", "LIFO", "AVCO"], default: "LIFO", required: [true, "Why no valuation?"] },
    unitPrice: { type: Number, required: [true, "Why no Unit price?"] },
    costPrice: { type: Number, required: [false, "Why no cost price?"] },
    slashPrice: { type: Number },
    discount: { type: Number, required: [false, "Why no Discount?"], default: 0.0 },
    discountType: { type: String, enum: ["fixed", "percent"], default: "percent" },
    tax: { type: Number, required: [false, "Why no Tax?"], default: 0.0 },
    taxType: { type: String, enum: ["fixed", "percent"], default: "percent" },
  },
  images: {
    image_sm: { type: String, default: "default-product-sm-image.jpg" },
    image_md: { type: String, default: "default-product-md-image.jpg" },
    image_lg: { type: String, default: "default-product-lg-image.jpg" },
    image_front: { type: String, default: "default-product-front-image.jpg" },
    image_back: { type: String, default: "default-product-back-image.jpg" },
    image_top: { type: String, default: "default-product-top-image.jpg" },
    image_bottom: { type: String, default: "default-product-bottom-image.jpg" },
    image_right: { type: String, default: "default-product-right-image.jpg" },
    image_left: { type: String, default: "default-product-left-image.jpg" },
    icon: { type: String, default: "default-product-icon.jpg" },
  },
  shippingDetails: {
    cost: { type: Number, default: 0.0 },
    weight: { type: String, max: 20 },
    length: { type: String, max: 20 },
    width: { type: String, max: 20 },
    height: { type: String, max: 20 },
  },
  manufactureDetails: {
    make: { type: String, max: 100 },
    modelNumber: { type: String, max: 100 },
    releaseDate: { type: Date },
  },
  download: {
    downloadable: { type: Boolean, required: [false, "Why no Download?"], default: false },
    downloadName: { type: String, default: "Bezop-Product-Download" },
  },
  available: { type: Number, min: 0, default: 0 },
  extraFields: [{
    name: { type: String, max: 200 },
    value: { type: String, max: 500 },
  }],
  approvalAdmin: {
    approved: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
    approvedBy: { type: Schema.Types.ObjectId, ref: "Admin" },
    comment: { type: String },
  },
  approval: { type: Schema.Types.ObjectId, ref: "Approval" },
  approved: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
  analytics: {
    feature: { type: Boolean, default: false },
    advertise: { type: Boolean, default: false },
    viewDate: { type: Date, default: Date.now },
    viewCount: { type: Number, default: 1 },
    totalSold: { type: Number, default: 1 },
    totalOrdered: { type: Number, default: 1 },
  },
  review: [{
    type: Schema.Types.ObjectId,
    ref: "Review",
    es_type: "nested",
    es_include_in_parent: true,

    es_select: "id name icon",
  }],
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

ProductSchema.index({ createdAt: 1 });

ProductSchema.methods = {
  view(full) {
    const view = {
      // simple view
      id: this.id,
      code: this.code,
      sku: this.sku,
      upc: this.upc,
      name: this.name,
      vendor: this.vendor,
      category: this.category,
      collections: this.collections,
      brand: this.brand,
      description: this.description,
      variety: this.variety,
      price: this.price,
      images: this.images,
      shippingDetails: this.shippingDetails,
      manufactureDetails: this.manufactureDetails,
      download: this.download,
      extraFields: this.extraFields,
      approval: this.approval,
      analytics: this.analytics,
      standing: this.standing,
    };

    return full ? {
      ...view,
      updated: this.updated,
      admin: this.admin,
      action: this.action,
    } : view;
  },
};

/* Do not declare methods using ES6 arrow functions (=>).
  Arrow functions explicitly prevent binding this, so your
  method will not have access to the document and the above examples will not work.
*/

// assign a function to the "methods" object of our ProductSchema
ProductSchema.methods.findSimilarBrands = function (cb) {
  return this.model("Product").find({ brand: this.brand }, cb);
};

ProductSchema.plugin(mongoosastic, {
  host: process.env.ELASTICSEARCH_URL,
  port: process.env.ELASTICSEARCH_PORT,
  /*
  populate: [
    { path: "review", select: "id subjectId comment rating customer" },
    { path: "vendor", select: "id url businessName domainName approval" },
    { path: "brand", select: "id name icon" },
    { path: "collections", select: "id name icon" },
    { path: "category", select: "id name icon" },
  ],
  hydrate: true,
  */
});

const Product = mongoose.model("Product", ProductSchema);
export const { ObjectId } = mongoose.Types.ObjectId;
export default Product;
