import { success, fail } from "./../../services/response/";
import Setting from "./model";
import { getAnyAdmin } from "../admin/init";
import { getAnyProduct } from "../product/init";

export async function initSetting(req, res) {
  let admin;
  try {
    admin = await getAnyAdmin();
  } catch (err) {
    console.log(err);
  }

  if (!(admin)) admin = { _id: "5b83c483f85b7a561ce95107" };

  const setting0 = new Setting({
    admin: admin._id,
    code: "API",
    kind: "operations",
    scope: "global",
    name: "Validate API key for all applications",
    value: "true",
    description: "Permits or deny applications access the Backend",
  });
  setting0.save().then(console.log("Added settings"));

  const setting1 = new Setting({
    admin: admin._id,
    code: "EMAIL_AUTH",
    kind: "operations",
    scope: "vendor",
    name: "Email Authentication for Vendors",
    value: "ALLOW",
    description: "Permits Vendors authentication with email",
  });
  setting1.save().then(console.log("Added settings"));

  const setting2 = new Setting({
    admin: admin._id,
    code: "EMAIL_AUTH",
    kind: "operations",
    scope: "admin",
    name: "Email Authentication for Admins",
    value: "ALLOW",
    description: "Permits Admins authentication with email",
  });
  setting2.save().then(console.log("Added settings"));

  const setting3 = new Setting({
    admin: admin._id,
    code: "EMAIL_AUTH",
    kind: "operations",
    scope: "customer",
    name: "Email Authentication for Customers",
    value: "ALLOW",
    description: "Permits Customers authentication with email",
  });
  setting3.save().then(console.log("Added settings"));

  const setting4 = new Setting({
    admin: admin._id,
    code: "PRODUCT_ACCEPTANCE",
    kind: "operations",
    scope: "global",
    name: "Product Acceptance Limit",
    value: "5",
    description: `The minimum amount of acceptance granted a product
                 to be available in the marketplace by crowd approval by co-vendors`,
  });

  return setting4.save()
    .then((result) => {
      if (!result) {
        fail(res, 404, "Error not found newly added Setting");
      }
      console.log(`\r\nSetting is added ${result.id}`);
      return success(res, 200, result, "Done Initializing Setting Data!");
    }).catch((err) => {
      fail(res, 500, `Error adding Setting ${err.message}`);
    });
}

export function getAnySetting() {
  Setting.findOne().sort({ created_at: -1 }).exec((_err, result) => result);
}
