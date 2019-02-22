import { success, fail } from "./../../services/response/";
import Product from "./model";
import { getAnyVendor } from "../vendor/init";
import { getAnyAdmin } from "../admin/init";

export async function initProduct(req, res) {
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

  if (!(vendor)) vendor = { _id: "5b54e618ae6b2a035fe83843" };

  const product1 = new Product({
    _id: ("5b83d6fef85b7a561ce9510e"),
    vendor: vendor._id,
    sku: "123",
    upc: "123",
    name: "Android Phone",
    brand: ("5b83d638f85b7a561ce9510d"),
    category: ("5b83d082f85b7a561ce95109"),
    collections: ("5b83d082f85b7a561ce95109"),
    descriptionColor: ["Grey"],
    descriptionUnit: "Set",
    descriptionTag: ["Android", "Phone"],
    descriptionLong: "8inches Andoid Phone",
    descriptionShort: "Android Phone",
    variety: {
      options: false,
      parent: "",
    },
    price: {
      deal: true,
      valuation: "LIFO",
      discount: 7345,
      discountType: "fixed",
      tax: 10,
      taxType: "percent",
      unitPrice: 23280,
      costPrice: 19009,
      slashPrice: 862980,
    },
    images: {
      image_sm: "default-product-sm-image.jpg",
      image_md: "default-product-md-image.jpg",
      image_lg: "https://storage.googleapis.com/olaife/images/media/5b83d6fef85b7a561ce9510e75380a2f5e20f897f01ce62aac998eff.jpeg",
      image_front: "default-product-front-image.jpg",
      image_back: "default-product-back-image.jpg",
      image_top: "default-product-top-image.jpg",
      image_bottom: "default-product-bottom-image.jpg",
      image_right: "default-product-right-image.jpg",
      image_left: "default-product-left-image.jpg",
      icon: "default-product-icon.jpg",
    },
    shippingDetails: {
      cost: 1910,
      weight: "4",
      length: "3",
      width: "2",
      height: "2",
    },
    manufactureDetails: {
      make: "Tecno",
      modelNumber: "Y6",
      releaseDate: Date("2018-08-14T00:00:00Z"),
    },
    download: {
      downloadable: false,
      downloadName: "Bezop-Product-Download",
    },
    analytics: {
      feature: false,
      advertise: false,
      viewCount: 1,
      totalSold: 1,
      totalOrdered: 1,
      viewDate: Date("2018-08-27T10:48:30.209Z"),
    },
    code: "123",
    available: 19,
    standing: "active",
    action: "allow",
  });

  product1.save().then(result => console.log(result.name));

  const product2 = new Product({
    _id: ("5b83d78ff85b7a561ce95110"),
    vendor: vendor._id,
    sku: "42",
    upc: "312",
    name: "Wrist Watch",
    brand: ("5b83d591f85b7a561ce9510c"),
    category: ("5b83d2a5f85b7a561ce9510a"),
    collections: ("5b83d082f85b7a561ce95109"),
    descriptionColor: ["Black"],
    descriptionUnit: "Set",
    descriptionTag: ["Wrist", "Watch"],
    descriptionLong: "McKlien Diamond wrist watch",
    descriptionShort: "Wrist Watch",
    variety: {
      options: false,
      parent: "",
    },
    price: {
      deal: true,
      valuation: "LIFO",
      discount: 30,
      discountType: "percent",
      tax: 3230,
      taxType: "fixed",
      unitPrice: 32443,
      costPrice: 4353,
      slashPrice: 123442,
    },
    images: {
      image_sm: "default-product-sm-image.jpg",
      image_md: "default-product-md-image.jpg",
      image_lg: "https://storage.googleapis.com/olaife/images/media/5b83d78ff85b7a561ce95110df4defd832093f90b5848e47d3e23903.jpeg",
      image_front: "default-product-front-image.jpg",
      image_back: "default-product-back-image.jpg",
      image_top: "default-product-top-image.jpg",
      image_bottom: "default-product-bottom-image.jpg",
      image_right: "default-product-right-image.jpg",
      image_left: "default-product-left-image.jpg",
      icon: "default-product-icon.jpg",
    },
    shippingDetails: {
      cost: 2330,
      weight: "4",
      length: "3",
      width: "4",
      height: "2",
    },
    manufactureDetails: {
      make: "Watch",
      modelNumber: "34f",
      releaseDate: Date("2018-08-10T00:00:00Z"),
    },
    download: {
      downloadable: false,
      downloadName: "Bezop-Product-Download",
    },
    analytics: {
      feature: false,
      advertise: false,
      viewCount: 1,
      totalSold: 1,
      totalOrdered: 1,
      viewDate: Date("2018-08-27T10:50:55.783Z"),
    },
    code: "12",
    available: 16,
    standing: "active",
    action: "allow",
  });

  product2.save().then(result => console.log(result.name));

  const product3 = new Product({
    _id: ("5b83d810f85b7a561ce95112"),
    vendor: vendor._id,
    sku: "323",
    upc: "235",
    name: "Headset",
    brand: ("5b83d638f85b7a561ce9510d"),
    category: ("5b83d3f1f85b7a561ce9510b"),
    collections: ("5b83d082f85b7a561ce95109"),
    descriptionColor: ["Grey"],
    descriptionUnit: "Set",
    descriptionTag: ["Samsung", "TV"],
    descriptionLong: "24inches HD Samsung TV",
    descriptionShort: "Samsung",
    variety: {
      options: false,
      parent: "",
    },
    price: {
      deal: true,
      valuation: "LIFO",
      discount: 29,
      discountType: "percent",
      tax: 30,
      taxType: "percent",
      unitPrice: 423121,
      costPrice: 32424,
      slashPrice: 2345332,
    },
    images: {
      image_sm: "default-product-sm-image.jpg",
      image_md: "default-product-md-image.jpg",
      image_lg: "https://storage.googleapis.com/olaife/images/media/5b83d810f85b7a561ce951127347594e4753863b2a4588d294ee17ff.jpeg",
      image_front: "https://storage.googleapis.com/olaife/images/media/5b83d810f85b7a561ce95112ddbcf5da988dfe20714b6f2cd55fff9c.jpeg",
      image_back: "https://storage.googleapis.com/olaife/images/media/5b83d810f85b7a561ce95112b1bafce931801bde7d469ecf28672664.jpeg",
      image_top: "default-product-top-image.jpg",
      image_bottom: "default-product-bottom-image.jpg",
      image_right: "default-product-right-image.jpg",
      image_left: "default-product-left-image.jpg",
      icon: "default-product-icon.jpg",
    },
    shippingDetails: {
      cost: 3420,
      weight: "2",
      length: "3",
      width: "2",
      height: "4",
    },
    manufactureDetails: {
      make: "Head",
      modelNumber: "Phone",
      releaseDate: Date("2018-08-07T00:00:00Z"),
    },
    download: {
      downloadable: false,
      downloadName: "Bezop-Product-Download",
    },
    analytics: {
      feature: false,
      advertise: false,
      viewCount: 1,
      totalSold: 1,
      totalOrdered: 1,
      viewDate: Date("2018-08-27T10:53:04.598Z"),
    },
    code: "234",
    available: 8,
    standing: "active",
    action: "allow",
  });

  product3.save().then(result => console.log(result.name));

  const product = new Product({
    _id: ("5b8585553c7f84a81b45e70b"),
    category: ("5b83d3f1f85b7a561ce9510b"),
    collections: ("5b83d082f85b7a561ce95109"),
    descriptionColor: ["Grey"],
    descriptionUnit: "Set",
    descriptionTag: ["Samsung", "TV"],
    descriptionLong: "24inches HD Samsung TV",
    descriptionShort: "Samsung",
    variety: {
      options: false,
      parent: "",
    },
    price: {
      deal: true,
      valuation: "FIFO",
      discount: 0,
      discountType: "percent",
      tax: 0,
      taxType: "percent",
      unitPrice: 40000,
      costPrice: 3400,
      slashPrice: 50000,
    },
    images: {
      image_sm: "default-product-sm-image.jpg",
      image_md: "default-product-md-image.jpg",
      image_lg: "https://storage.googleapis.com/olaife/images/media/5b8585553c7f84a81b45e70bb5b3eb1635fac9c8fe0e314c549488c9.jpeg",
      image_front: "default-product-front-image.jpg",
      image_back: "default-product-back-image.jpg",
      image_top: "default-product-top-image.jpg",
      image_bottom: "default-product-bottom-image.jpg",
      image_right: "default-product-right-image.jpg",
      image_left: "default-product-left-image.jpg",
      icon: "default-product-icon.jpg",
    },
    shippingDetails: {
      cost: 0,
    },
    download: {
      downloadable: false,
      downloadName: "Bezop-Product-Download",
    },
    analytics: {
      feature: false,
      advertise: false,
      viewCount: 1,
      totalSold: 1,
      totalOrdered: 1,
      viewDate: Date("2018-08-28T17:24:37.170Z"),
    },
    code: "742371",
    available: 296,
    standing: "active",
    action: "allow",
    vendor: vendor._id,
    sku: "sku 20",
    upc: "upc 23",
    name: "Head Set",
    brand: ("5b83d638f85b7a561ce9510d"),
  });

  return product.save()
    .then((result) => {
      if (!result) {
        fail(res, 404, "Error not found newly added Product");
      }
      console.log(`Product is added ${result.id}`);
      return success(res, 200, result, "Done Initializing Product Data!");
    }).catch((err) => {
      fail(res, 500, `Error initializing Product records. ${err.message}`);
    });
}

export function getAnyProduct() {
  Product.findOne().sort({ created_at: -1 }).exec((_err, result) => result);
}
