import { success, fail } from "./../../services/response/";
import Template from "./model";
import { getAnyAdmin } from "../admin/init";

export async function initTemplate(req, res) {
  let admin;
  try {
    admin = await getAnyAdmin();
  } catch (err) {
    console.log(err);
  }

  if (!(admin)) admin = { _id: "5b54e618ae6b2a035fe83843" };

  const template = {
    admin: admin._id,
    name: "newsletter template",
    page: "newsletter",
    icon: "https://storage.googleapis.com/olaife/images/media/5b83d6fef85b7a561ce9510e75380a2f5e20f897f01ce62aac998eff.jpeg",
    style: "stylesheet",
    placeholders: [{
      attribute: "color",
      value: "purple",
    }],
  };

  const record = new Template(template);
  return record.save()
    .then((result) => {
      if (!result) {
        fail(res, 404, "Error not found newly added Template");
      }
      console.log(`\r\nTemplate is added ${result.id}`);
      return success(res, 200, result, "Done Initializing Template Data!");
    }).catch((err) => {
      fail(res, 500, `Error adding Template ${err.message}`);
    });
}

export function getAnyTemplate() {
  Template.findOne().sort({ created_at: -1 }).exec((_err, result) => result);
}
