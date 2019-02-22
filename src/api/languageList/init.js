import { success, fail } from "./../../services/response/";
import LanguageList from "./model";
import { getAnyAdmin } from "../admin/init";

export async function initLanguageList(req, res) {

  let admin;
  try {
    admin = await getAnyAdmin();
  } catch (err) {
    console.log(err);
  }

  if (!(admin)) admin = { _id: "5b83c483f85b7a561ce95107" };

  const languageList = new LanguageList({
    standing: "active",
    name: "Bangla",
    dbField: "bangla",
    icon: "BN",
  });

  languageList.save()
  
  const languageList1 = new LanguageList({
    name: "English",
    dbField: "english",
    icon: "EN",
  });
  
  languageList1.save();

  
  const languageList2 = new LanguageList({
    name: "French",
    dbField: "french",
    icon: "FR",
  });
  
  languageList2.save();
  
  const languageList3 = new LanguageList({
    name: "Spanish",
    dbField: "spanish",
    icon: "SP",
  });
  
  languageList3.save();
  
  const languageList4 = new LanguageList({
    name: "Chinese",
    dbField: "chinese",
    icon: "CN",
  });
  
  languageList4.save();
  
  const languageList5 = new LanguageList({
    name: "Arabic",
    dbField: "arabic",
    icon: "AR",
  });
  
  languageList5.save();
  
  const languageList6 = new LanguageList({
    name: "Bangla",
    dbField: "bangla",
    icon: "BN",
  });
  
  return languageList6.save()
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

export function getAnyLanguageList() {
  LanguageList.findOne().sort({ created_at: -1 }).exec((_err, result) => result);
}
