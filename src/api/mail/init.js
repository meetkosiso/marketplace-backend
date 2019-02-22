import { success, fail } from "./../../services/response/";
import Mail from "./model";
import { getAnyAdmin } from "../admin/init";
import { getAnyVendor } from "../vendor/init";
import { getAnyLanguageList } from "../languageList/init";

export async function initMail(req, res) {
  let admin;
  try {
    admin = await getAnyAdmin();
  } catch (err) {
    console.log(err);
  }
  if (!(admin)) admin = { _id: "5b83c483f85b7a561ce95107" };

  let vendor;
  try {
    vendor = await getAnyVendor();
  } catch (err) {
    console.log(err);
  }
  if (!(vendor)) vendor = { _id: "5b83c483f85b7a561ce95107" };


  let languageList;
  try {
    languageList = await getAnyLanguageList();
  } catch (err) {
    console.log(err);
  }
  if (!(languageList)) languageList = { _id: "5b83c483f85b7a561ce95107" };

  const mail = {
    admin: admin._id,
    createdType: "vendor",
    createdBy: vendor._id,
    name: "Discount Newsletter",
    kind: "newsletter",
    language: languageList._id,
    mailSubject: "New Offers",
    mailBody: "Buy one take 2 free",
    recipient: "customer",
  };

  const record = new Mail(mail);
  return record.save()
    .then((result) => {
      if (!result) {
        fail(res, 404, "Error not found newly added Mail");
      }
      console.log(`\r\nMail is added ${result.id}`);
      return success(res, 200, result, "Done Initializing Mail Data!");
    }).catch((err) => {
      fail(res, 500, `Error adding Mail ${err.message}`);
    });
}

export function getAnyMail() {
  Mail.findOne().sort({ created_at: -1 }).exec((_err, result) => result);
}
