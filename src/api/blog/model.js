/**
* @property {String} kind  Blog type which could be "news", "post"
* @property {String} title  Blog title
* @property {String} summary  Blog summary
* @property {Object} vendor  Blog Author or vendor who created the blog post|news
* @property {String} content  Blog content or blog body
* @property {String} tag  Blog tags array of key words
* @property {String} image  Blog image 1 image for now
* @property {String} viewCount {Number} Number of views of the blog
* @property {String} standing  Blog publish status "active", "inactive", "trashed"
* active blogs are published, inactive are unpublished or pending.
* trashed items can be restore after a while if the system has not emptied it automatically
* @property {Date} updated  Date of last update
* @property {Object} admin  The admin's ObjectId who last modified the record
* @property {String} action  The admins' action on the record ["allow", "restrict", "deny"]
* allow: owner can display, transact, update, modify standing or #delete record
* restrict: owner can update, modify #delete record by cannot display or transact it
* deny: record cannot be updated, modified, display by owner and its readonly.
*/

import mongoose, { Schema } from "mongoose";
import mongoosastic from "mongoosastic";
import Admin from "../admin/model";
import Vendor from "../vendor/model";
import Review from "../review/model";

const BlogSchema = new Schema({
  vendor: { type: Schema.Types.ObjectId, ref: "Vendor", required: [true, "Why no Vendor?"], es_indexed: true },
  review: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  kind: { type: String, enum: ["news", "post"], default: "post" },
  title: { type: String, required: [true, "Why no Title?"], es_indexed: true },
  summary: { type: String, required: [true, "Why no Summary?"], es_indexed: true },
  content: { type: String, required: [true, "Why no content?"] },
  tag: { type: Array, required: [true, "Why no Tag?"], es_indexed: true },
  image: { type: String },
  meta: {
    views: { type: Number, default: 1 },
    votes: { type: Number, default: 1 },
  },
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

BlogSchema.methods = {
  view(full) {
    const view = {
      id: this.id,
      kind: this.kind,
      title: this.title,
      summary: this.summary,
      vendor: this.vendor,
      content: this.content,
      tag: this.tag,
      image: this.image,
      updatedAt: this.updatedAt,
      createdAt: this.createdAt,
      action: this.action,
    };

    return full ? {
      ...view,
      viewCount: this.viewCount,
      updated: this.updated,
      admin: this.admin,
    } : view;
  },
};

BlogSchema.plugin(mongoosastic, {
  host: process.env.ELASTICSEARCH_URL,
  port: process.env.ELASTICSEARCH_PORT,
  hydrate: true,
  hydrateOptions: { lean: true },
});

const Blog = mongoose.model("Blog", BlogSchema);
export const { ObjectId } = mongoose.Types.ObjectId;
export default Blog;
