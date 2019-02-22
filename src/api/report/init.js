import { success, fail } from "./../../services/response/";
import Report from "./model";
import { getAnyAdmin } from "../admin/init";

export async function initReport(req, res) {
  let admin;
  try {
    admin = await getAnyAdmin();
  } catch (err) {
    console.log(err);
  }

  if (!(admin)) admin = { _id: "5b83c483f85b7a561ce95107" };

  const report1 = new Report({
    _id: ("1b83d6faf85b7a561ce9510a"),
    admin,
    code: "SALES",
    name: "Sales Report",
    description: "Report of products sales between a given period",
  });
  report1.save().then(result => console.log(`${result.name} report is saved`));

  const report2 = new Report({
    _id: ("1b83d6faf85b7a561ce9510b"),
    admin,
    code: "STOCK",
    name: "Stock Report",
    description: "Report of stock position between a given period",
  });
  report2.save().then(result => console.log(`${result.name} report is saved`));

  const report3 = new Report({
    _id: ("1b83d6faf85b7a561ce9510c"),
    admin,
    code: "REVIEW",
    name: "Review Report",
    description: "Report of customers reviews between a given period",
  });
  report3.save().then(result => console.log(`${result.name} report is saved`));

  const report4 = new Report({
    _id: ("1b83d6faf85b7a561ce9510d"),
    admin,
    code: "TICKET",
    name: "Ticket Report",
    description: "Report of Ticket raised by customers between a given period",
  });
  report4.save().then(result => console.log(`${result.name} report is saved`));

  const report5 = new Report({
    _id: ("1b83d6faf85b7a561ce9511e"),
    admin,
    code: "TRANSACTION",
    name: "Transactions Report",
    description: "Report of Blockchain Transactions between a given period",
  });
  report5.save().then(result => console.log(`${result.name} report is saved`));


  const report6 = new Report({
    _id: ("1b83d6faf85b7a561ce9512e"),
    admin,
    code: "APPROVAL",
    name: "Approval Report",
    description: "Report of Product Approval between a given period",
  });
  report6.save().then(result => console.log(`${result.name} report is saved`));

  const report7 = new Report({
    _id: ("1b83d6faf85b7a561ce9513e"),
    admin,
    code: "ADVERT",
    name: "Advert Report",
    description: "Report of Product Advertisment between a given period",
  });
  report7.save().then(result => console.log(`${result.name} report is saved`));

  const report8 = new Report({
    _id: ("1b83d6faf85b7a561ce9513e"),
    admin,
    code: "COUPON",
    name: "Coupon Report",
    description: "Report of Product Coupon between a given period",
  });

  return report8.save()
    .then((result) => {
      if (!result) {
        fail(res, 404, "Error not found newly added Report");
      }
      console.log(`\r\nReport is added ${result.id}`);
      return success(res, 200, result, "Done Initializing Report Data!");
    }).catch((err) => {
      fail(res, 500, `Error adding Report ${err.message}`);
    });
}

export function getAnyReport() {
  Report.findOne().sort({ created_at: -1 }).exec((_err, result) => result);
}
