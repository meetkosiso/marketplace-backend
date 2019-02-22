/**
 * @description Thirdparty applications that want to use our API Application
 * have to signup and automatically generate their apikey after confirming their email.
 * The API also records their number of api calls made. Users can always generate
 * a new API_KEY. The Key is send along every API calls they make.
 * @property {String} username ApiUser's username
 * @property {Array} lastAccess [{accessDate, ipAddress}] ApiUser's last login/access
 * @property {String} fullname ApiUser's first and last name
 * @property {String} password ApiUser's password
 * @property {String} email ApiUser's email address
 * @property {Array} notifications [{date, notice, standing}] ApiUser's notifications
 * @property {String} standing ApiUser's status
 * @property {Date} updated update date
 * @property {String} updatedBy Admin Id of staff (Super or Master Admin) who updated the record
 */


import mongoose, { Schema } from "mongoose";
import { randomNum } from "./../../services/helpers";

const ApiuserSchema = new Schema({
  username: { type: String, default: "" },
  lastAccess: [{
    accessDate: { type: Date },
    ipAddress: { type: String, min: 15, max: 45 },
  }],
  fullname: { type: String, default: "" },
  phone: { type: String, default: "" },
  email: { type: String, lowercase: true },
  password: { type: String },
  apikey: { type: String, default: randomNum() },
  apicalls: {
    amount: { type: Number, default: 0 },
    rate: { type: Number },
  },
  notifications: [{
    date: { type: Date, default: Date.now },
    notice: { type: String, max: 2000, default: "Bezop Api notification" },
    standing: { type: String, enum: ["unread", "read", "trashed"], default: "unread" },
  }],
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

const Apiuser = mongoose.model("Apiuser", ApiuserSchema);

export const { ObjectId } = mongoose.Types.ObjectId;
export default Apiuser;
