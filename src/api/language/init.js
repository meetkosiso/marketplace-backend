import { success, fail } from "./../../services/response/";
import Language from "./model";
import { getAnyAdmin } from "../admin/init";

export async function initLanguage(req, res) {

  let admin;
  try {
    admin = await getAnyAdmin();
  } catch (err) {
    console.log(err);
  }

  if (!(admin)) admin = { _id: "5b83c483f85b7a561ce95107" };

  const language = {
    phraseId: 1,
    phrase: "visit_home_page",
    english: "Visit Home Page",
    french: "visite page d'accueil",
    spanish: "visita la página de inicio",
    bangla: "দর্শন হোম পেজে",
    arabic: "الصفحة الرئيسية زيارة ",
    chinese: "访问主页",
  };

  const record = new Language(language);
  return record.save()
    .then((result) => {
      if (!result) {
        fail(res, 404, "Error not found newly added Language");
      }
      console.log(`\r\nLanguage is added ${result.id}`);
      return success(res, 200, result, "Done Initializing Language Data!");
    }).catch((err) => {
      fail(res, 500, `Error adding Language ${err.message}`);
    });
}

export function getAnyLanguage() {
  Language.findOne().sort({ created_at: -1 }).exec((_err, result) => result);
}
