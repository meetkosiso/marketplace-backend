import { success, fail } from "./../../services/response/";
import Collection from "./model";
import { getAnyAdmin } from "../admin/init";
import { getAnyVendor } from "../vendor/init";

export async function initCollection(req, res) {
  let admin;
  try {
    admin = await getAnyAdmin();
  } catch (err) {
    console.log(err);
  }

  if (!(admin)) admin = { _id: "5b54e618ae6b2a035fe83843" };

  let vendor;
  try {
    vendor = await getAnyVendor();
  } catch (err) {
    console.log(err);
  }

  if (!(vendor)) vendor = { _id: "5b83c483f85b7a561ce95107" };


  const collection1 = new Collection({
    _id: ("5b83d082f85b7a561ce95111"),
    parent: "0",
    standing: "active",
    action: "allow",
    name: "Smart Phones",
    description: "Smart Phone Collections.",
    kind: "physical",
    banner: "https://storage.googleapis.com/olaife/images/media/5b83d082f85b7a561ce951092dc855082f6fb1708614209d5e9343ef.jpeg",
    icon: "https://storage.googleapis.com/olaife/images/media/5b83d082f85b7a561ce95109c93f01b138b0ff3deed6d52015cd2585.jpeg"
  });
  collection1.save().then(result => console.log(result.name));

  const collection2 = new Collection({
    _id: ("5b83d082f85b7a561ce95112"),
    parent: "0",
    standing: "active",
    action: "allow",
    name: "Phones",
    description: "Phones Collections.",
    kind: "physical",
    icon: "https://storage.googleapis.com/olaife/images/media/5b83d2a5f85b7a561ce9510aa972f26f34c3ad4aeb2663454088f44a.jpeg",
    banner: "https://storage.googleapis.com/olaife/images/media/5b83d2a5f85b7a561ce9510abf690bf46f4d230ddaff108fcca86d68.jpeg"
  });

  collection2.save().then(result => console.log(result.name));

  const collection3 = new Collection({
    _id: ("5b83d082f85b7a561ce95113"),
    parent: "0",
    standing: "active",
    action: "allow",
    name: "Entertainment",
    description: "Entertainment Collection.",
    kind: "physical",
    icon: "https://storage.googleapis.com/olaife/images/media/5b83d3f1f85b7a561ce9510b1231f13ad62983074f469b6a6718173c.jpeg",
    banner: "https://storage.googleapis.com/olaife/images/media/5b83d3f1f85b7a561ce9510bc9f3ee7882b9c62ec68a17a26319edb2.jpeg"
  });

  collection3.save().then(result => console.log(result.name));

  const collection4 = new Collection({
    _id: ("5b83d082f85b7a561ce95114"),
    parent: "0",
    standing: "active",
    action: "allow",
    name: "Tablets",
    description: "Tablets Collection.",
    kind: "physical",
    icon: "https://storage.googleapis.com/olaife/images/media/5b83d3f1f85b7a561ce9510b1231f13ad62983074f469b6a6718173c.jpeg",
    banner: "https://storage.googleapis.com/olaife/images/media/5b83d3f1f85b7a561ce9510bc9f3ee7882b9c62ec68a17a26319edb2.jpeg"
  });
  collection4.save().then(result => console.log(result.name));

  const collection5 = new Collection({
    _id: ("5b83d082f85b7a561ce95115"),
    parent: "0",
    standing: "active",
    action: "allow",
    name: "Computing",
    description: "Computing Collection.",
    kind: "physical",
    icon: "https://storage.googleapis.com/olaife/images/media/5b83d3f1f85b7a561ce9510b1231f13ad62983074f469b6a6718173c.jpeg",
    banner: "https://storage.googleapis.com/olaife/images/media/5b83d3f1f85b7a561ce9510bc9f3ee7882b9c62ec68a17a26319edb2.jpeg"
  });
  collection5.save().then(result => console.log(result.name));

  const collection6 = new Collection({
    _id: ("5b83d082f85b7a561ce95116"),
    parent: "0",
    standing: "active",
    action: "allow",
    name: "Electronics",
    description: "Electronics Collection.",
    kind: "physical",
    icon: "https://storage.googleapis.com/olaife/images/media/5b83d3f1f85b7a561ce9510b1231f13ad62983074f469b6a6718173c.jpeg",
    banner: "https://storage.googleapis.com/olaife/images/media/5b83d3f1f85b7a561ce9510bc9f3ee7882b9c62ec68a17a26319edb2.jpeg"
  });
  collection6.save().then(result => console.log(result.name));

  const collection7 = new Collection({
    _id: ("5b83d082f85b7a561ce95117"),
    parent: "0",
    standing: "active",
    action: "allow",
    name: "Home",
    description: "Home Collection.",
    kind: "physical",
    icon: "https://storage.googleapis.com/olaife/images/media/5b83d3f1f85b7a561ce9510b1231f13ad62983074f469b6a6718173c.jpeg",
    banner: "https://storage.googleapis.com/olaife/images/media/5b83d3f1f85b7a561ce9510bc9f3ee7882b9c62ec68a17a26319edb2.jpeg"
  });
  collection7.save().then(result => console.log(result.name));

  const collection8 = new Collection({
    _id: ("5b83d082f85b7a561ce95118"),
    parent: "0",
    standing: "active",
    action: "allow",
    name: "Office",
    description: "Office Collection.",
    kind: "physical",
    icon: "https://storage.googleapis.com/olaife/images/media/5b83d3f1f85b7a561ce9510b1231f13ad62983074f469b6a6718173c.jpeg",
    banner: "https://storage.googleapis.com/olaife/images/media/5b83d3f1f85b7a561ce9510bc9f3ee7882b9c62ec68a17a26319edb2.jpeg"
  });
  collection8.save().then(result => console.log(result.name));

  const collection9 = new Collection({
    _id: ("5b83d082f85b7a561ce95119"),
    parent: "0",
    standing: "active",
    action: "allow",
    name: "Fashion",
    description: "Fashion Collection.",
    kind: "physical",
    icon: "https://storage.googleapis.com/olaife/images/media/5b83d3f1f85b7a561ce9510b1231f13ad62983074f469b6a6718173c.jpeg",
    banner: "https://storage.googleapis.com/olaife/images/media/5b83d3f1f85b7a561ce9510bc9f3ee7882b9c62ec68a17a26319edb2.jpeg"
  });
  collection9.save().then(result => console.log(result.name));

  const collection10 = new Collection({
    _id: ("5b83d082f85b7a561ce9511a"),
    parent: "0",
    standing: "active",
    action: "allow",
    name: "Health",
    description: "Health Collection.",
    kind: "physical",
    icon: "https://storage.googleapis.com/olaife/images/media/5b83d3f1f85b7a561ce9510b1231f13ad62983074f469b6a6718173c.jpeg",
    banner: "https://storage.googleapis.com/olaife/images/media/5b83d3f1f85b7a561ce9510bc9f3ee7882b9c62ec68a17a26319edb2.jpeg"
  });
  collection10.save().then(result => console.log(result.name));

  const collection11 = new Collection({
    _id: ("5b83d082f85b7a561ce9511b"),
    parent: "0",
    standing: "active",
    action: "allow",
    name: "Beauty",
    description: "Beauty Collection.",
    kind: "physical",
    icon: "https://storage.googleapis.com/olaife/images/media/5b83d3f1f85b7a561ce9510b1231f13ad62983074f469b6a6718173c.jpeg",
    banner: "https://storage.googleapis.com/olaife/images/media/5b83d3f1f85b7a561ce9510bc9f3ee7882b9c62ec68a17a26319edb2.jpeg"
  });
  collection11.save().then(result => console.log(result.name));

  const collection12 = new Collection({
    _id: ("5b83d082f85b7a561ce9511c"),
    parent: "0",
    standing: "active",
    action: "allow",
    name: "Gaming",
    description: "Gaming Collection.",
    kind: "physical",
    icon: "https://storage.googleapis.com/olaife/images/media/5b83d3f1f85b7a561ce9510b1231f13ad62983074f469b6a6718173c.jpeg",
    banner: "https://storage.googleapis.com/olaife/images/media/5b83d3f1f85b7a561ce9510bc9f3ee7882b9c62ec68a17a26319edb2.jpeg"
  });
  collection12.save().then(result => console.log(result.name));

  const collection13 = new Collection({
    _id: ("5b83d082f85b7a561ce9511d"),
    parent: "0",
    standing: "active",
    action: "allow",
    name: "Grocery",
    description: "Grocery Collection.",
    kind: "physical",
    icon: "https://storage.googleapis.com/olaife/images/media/5b83d3f1f85b7a561ce9510b1231f13ad62983074f469b6a6718173c.jpeg",
    banner: "https://storage.googleapis.com/olaife/images/media/5b83d3f1f85b7a561ce9510bc9f3ee7882b9c62ec68a17a26319edb2.jpeg"
  });
  collection13.save().then(result => console.log(result.name));

  const collection14 = new Collection({
    _id: ("5b83d082f85b7a561ce9511e"),
    parent: "0",
    standing: "active",
    action: "allow",
    name: "Baby Products",
    description: "Baby Products Collection.",
    kind: "physical",
    icon: "https://storage.googleapis.com/olaife/images/media/5b83d3f1f85b7a561ce9510b1231f13ad62983074f469b6a6718173c.jpeg",
    banner: "https://storage.googleapis.com/olaife/images/media/5b83d3f1f85b7a561ce9510bc9f3ee7882b9c62ec68a17a26319edb2.jpeg"
  });
  collection14.save().then(result => console.log(result.name));

  const collection15 = new Collection({
    _id: ("5b83d082f85b7a561ce95121"),
    parent: "0",
    standing: "active",
    action: "allow",
    name: "Toys",
    description: "Toys Collection.",
    kind: "physical",
    icon: "https://storage.googleapis.com/olaife/images/media/5b83d3f1f85b7a561ce9510b1231f13ad62983074f469b6a6718173c.jpeg",
    banner: "https://storage.googleapis.com/olaife/images/media/5b83d3f1f85b7a561ce9510bc9f3ee7882b9c62ec68a17a26319edb2.jpeg"
  });
  collection15.save().then(result => console.log(result.name));

  const collection16 = new Collection({
    _id: ("5b83d082f85b7a561ce95122"),
    parent: "0",
    standing: "active",
    action: "allow",
    name: "Games",
    description: "Games Collection.",
    kind: "physical",
    icon: "https://storage.googleapis.com/olaife/images/media/5b83d3f1f85b7a561ce9510b1231f13ad62983074f469b6a6718173c.jpeg",
    banner: "https://storage.googleapis.com/olaife/images/media/5b83d3f1f85b7a561ce9510bc9f3ee7882b9c62ec68a17a26319edb2.jpeg"
  });
  collection16.save().then(result => console.log(result.name));

  const collection17 = new Collection({
    _id: ("5b83d082f85b7a561ce95123"),
    parent: "0",
    standing: "active",
    action: "allow",
    name: "Sport",
    description: "Sport Collection.",
    kind: "physical",
    icon: "https://storage.googleapis.com/olaife/images/media/5b83d3f1f85b7a561ce9510b1231f13ad62983074f469b6a6718173c.jpeg",
    banner: "https://storage.googleapis.com/olaife/images/media/5b83d3f1f85b7a561ce9510bc9f3ee7882b9c62ec68a17a26319edb2.jpeg"
  });
  collection17.save().then(result => console.log(result.name));

  const collection18 = new Collection({
    _id: ("5b83d082f85b7a561ce95124"),
    parent: "0",
    standing: "active",
    action: "allow",
    name: "Automobile",
    description: "Automobile Collection.",
    kind: "physical",
    icon: "https://storage.googleapis.com/olaife/images/media/5b83d3f1f85b7a561ce9510b1231f13ad62983074f469b6a6718173c.jpeg",
    banner: "https://storage.googleapis.com/olaife/images/media/5b83d3f1f85b7a561ce9510bc9f3ee7882b9c62ec68a17a26319edb2.jpeg"
  });
  collection18.save().then(result => console.log(result.name));

  const collection19 = new Collection({
    _id: ("5b83d082f85b7a561ce95124"),
    parent: "0",
    standing: "active",
    action: "allow",
    name: "Multimedia",
    description: "Multimedia Collection.",
    kind: "physical",
    icon: "https://storage.googleapis.com/olaife/images/media/5b83d3f1f85b7a561ce9510b1231f13ad62983074f469b6a6718173c.jpeg",
    banner: "https://storage.googleapis.com/olaife/images/media/5b83d3f1f85b7a561ce9510bc9f3ee7882b9c62ec68a17a26319edb2.jpeg"
  });
  collection19.save().then(result => console.log(result.name));

  const collection20 = new Collection({
    _id: ("5b83d082f85b7a561ce95126"),
    parent: "0",
    standing: "active",
    action: "allow",
    name: "Accessories",
    description: "Accessories Collection.",
    kind: "physical",
    icon: "https://storage.googleapis.com/olaife/images/media/5b83d3f1f85b7a561ce9510b1231f13ad62983074f469b6a6718173c.jpeg",
    banner: "https://storage.googleapis.com/olaife/images/media/5b83d3f1f85b7a561ce9510bc9f3ee7882b9c62ec68a17a26319edb2.jpeg"
  });
  collection20.save().then(result => console.log(result.name));

  const collection21 = new Collection({
    _id: ("5b83d082f85b7a561ce95127"),
    parent: "0",
    standing: "active",
    action: "allow",
    name: "Tools",
    description: "Tools Collection.",
    kind: "physical",
    icon: "https://storage.googleapis.com/olaife/images/media/5b83d3f1f85b7a561ce9510b1231f13ad62983074f469b6a6718173c.jpeg",
    banner: "https://storage.googleapis.com/olaife/images/media/5b83d3f1f85b7a561ce9510bc9f3ee7882b9c62ec68a17a26319edb2.jpeg"
  });
  collection21.save().then(result => console.log(result.name));

  const collection22 = new Collection({
    _id: ("5b83d082f85b7a561ce95128"),
    parent: "0",
    standing: "active",
    action: "allow",
    name: "Appliances",
    description: "Appliances Collection.",
    kind: "physical",
    icon: "https://storage.googleapis.com/olaife/images/media/5b83d3f1f85b7a561ce9510b1231f13ad62983074f469b6a6718173c.jpeg",
    banner: "https://storage.googleapis.com/olaife/images/media/5b83d3f1f85b7a561ce9510bc9f3ee7882b9c62ec68a17a26319edb2.jpeg"
  });
  collection22.save().then(result => console.log(result.name));

  const collection23 = new Collection({
    _id: ("5b83d082f85b7a561ce95129"),
    parent: "0",
    standing: "active",
    action: "allow",
    name: "Furnitures",
    description: "Furnitures and Fittings Collection.",
    kind: "physical",
    icon: "https://storage.googleapis.com/olaife/images/media/5b83d3f1f85b7a561ce9510b1231f13ad62983074f469b6a6718173c.jpeg",
    banner: "https://storage.googleapis.com/olaife/images/media/5b83d3f1f85b7a561ce9510bc9f3ee7882b9c62ec68a17a26319edb2.jpeg"
  });
  collection23.save().then(result => console.log(result.name));

  const collection24 = new Collection({
    _id: ("5b83d082f85b7a561ce9512a"),
    parent: "0",
    standing: "active",
    action: "allow",
    name: "Services",
    description: "Services and Fittings Collection.",
    kind: "physical",
    icon: "https://storage.googleapis.com/olaife/images/media/5b83d3f1f85b7a561ce9510b1231f13ad62983074f469b6a6718173c.jpeg",
    banner: "https://storage.googleapis.com/olaife/images/media/5b83d3f1f85b7a561ce9510bc9f3ee7882b9c62ec68a17a26319edb2.jpeg"
  });
  collection24.save().then(result => console.log(result.name));

  const collection25 = new Collection({
    _id: ("5b83d082f85b7a561ce9512b"),
    parent: "0",
    standing: "active",
    action: "allow",
    name: "Others",
    description: "Others Collection.",
    kind: "physical",
    icon: "https://storage.googleapis.com/olaife/images/media/5b83d3f1f85b7a561ce9510b1231f13ad62983074f469b6a6718173c.jpeg",
    banner: "https://storage.googleapis.com/olaife/images/media/5b83d3f1f85b7a561ce9510bc9f3ee7882b9c62ec68a17a26319edb2.jpeg"
  });

  return collection25.save()
    .then((result) => {
      if (!result) {
        fail(res, 404, "Error not found newly added Collection");
      }
      console.log(`\r\nCollection is added ${result.id}`);
      return success(res, 200, result, "Done Initializing Collection Data!");
    }).catch((err) => {
      fail(res, 500, `Error adding Collection ${err.message}`);
    });
}

export function getAnyCollection() {
  Collection.findOne().sort({ created_at: -1 }).exec((_err, result) => result);
}
