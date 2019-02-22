
// import lodash from "lodash";
import Product, { ObjectId } from "./model";
import { findVendorByDomain, findVendorById } from "./../vendor/controller";
import { success, fail, notFound } from "../../services/response/index";
import { hasProp, propertyExist, getCurrentUnitPrice } from "../../services/helpers";
import { findOneOrderProduct } from "../order/controller";
import { findOneStockByProduct } from "../stock/controller";
// import { sendMail } from "../../services/helpers/EmailConfiguration";


// Find a single product with a given product id
export function findProductById(id) {
  return Product
    .findById(id)
    .populate({ path: "review", select: "id subjectId comment rating customer", match: { standing: "active" }, populate: { path: "customer" } })
    .populate({ path: "vendor", select: "id url businessName domainName contractAddress publicAddress" })
    .populate({ path: "brand", select: "id name icon" })
    .populate({ path: "collections", select: "id name icon" })
    .populate({ path: "category", select: "id name icon" })
    .populate({ path: "approval", select: "id reviewer product vendor comment approved standing" })
    .then((result) => {
      if (!result) return {};
      return result;
    })
    .catch((err) => { throw err; });
}

// Find a single product with a given vendor id
export function findProductByVendor(vendor) {
  return Product
    .findOne({ vendor })
    .then((result) => {
      if (!result) return false;
      return result;
    })
    .catch((err) => { throw err; });
}

// Find searched Products
export function searchProduct(quest) {
  return new Promise((resolve, reject) => Product.search(
    { query_string: { query: quest } },
    (err, results) => {
      if (!err) resolve(results);
      reject(err);
    },
  ));
}

// Find searched Products
export async function search(req, res) {
  const quest = req.query.q || "";
  if (!quest) return fail(res, 422, `Why incorrect query string ${quest}?`);
  const results = await searchProduct(quest);
  const records = results.hits.hits;
  const counts = parseInt(results.hits.total, 10);
  if (!(counts > 0)) return notFound(res, `${counts} record found!`);
  // Substitute vendor id with vendor object
  return Promise.all(results.hits.hits.map(async (record) => {
    record._source.vendorDetails = await findVendorById(record._source.vendor); // eslint-disable-line
  })).then(() => success(res, 200, records, `retrieved ${counts} record(s) successfully!`));
}


// Find all Products for Admin
export function findAllProducts(req, res) {
  // console.log("Working");
  // sendMail(
  //   "Odu Veronica",
  //   "oduveronica22@gmail.com",
  //   "vendor-registration",
  //   "Welcome Message",
  //   "Odewale Ifeoluwa",
  //   "ifeoluwa.odewale@gmail.com",
  //   {
  //     link: "http://bezop.com",
  //     name: "Odewale Ifeoluwa",
  //   },
  // );
  return Product.find()
    .populate({ path: "review", select: "id subjectId comment rating customer", match: { standing: "active" } })
    .populate({ path: "vendor", select: "id url businessName domainName contractAddress" })
    .populate({ path: "brand", select: "id name icon", match: { standing: "active" } })
    .populate({ path: "collections", select: "id name icon", match: { standing: "active" } })
    .populate({ path: "category", select: "id name icon", match: { standing: "active" } })
    .populate({ path: "approval", select: "id reviewer product vendor comment approved standing" })
    .then(result => success(res, 200, result, "retrieving record(s) was successfully!"))
    .catch(err => fail(res, 500, `Error retrieving record(s).\r\n${err.message}`));
}

/**
 * stockProduct add or subtract products from stock.available and product.available
 * @param {*} kind mode of operation either "addition"  or "subtraction"
 * @param {*} quantity the quantity to be incremented or decremented
 * @param {*} productId product object it
 * @param {*} unitPrice stock product unitPrice
 */
export async function stockProduct(kind, quantity, productId, unitPrice) {
  if (!((kind === "addition" || kind === "subtraction") && Number(quantity) > 0)) {
    throw new Error(`Invalid kind ${kind} or quantity ${quantity}`);
  }
  if (!ObjectId.isValid(productId)) throw new Error(`Invalid record Id ${productId}`);
  let product = {};
  let stock = {};
  try {
    product = await findProductById(productId);
    stock = await findOneStockByProduct(productId);
  } catch (err) {
    throw new Error(`error executing findProductById ${err}`);
  }
  if (kind === "addition") {
    console.log(`\r\n === Addition === \r\nproduct.available ${product.available} \r\nstock.available ${stock.available}`);
    product.available += Number(quantity);
    product.price.unitPrice = await getCurrentUnitPrice(product, quantity, unitPrice);
    stock.available = Number(product.available);
    console.log(`\r\nproduct.available ${product.available} \r\nstock.available ${stock.available}`);
  } else if (product.available > quantity) {
    console.log(`\r\n===Subtraction===\r\nproduct.available ${product.available} \r\nstock.available ${stock.available}`);
    product.available -= Number(quantity);
    stock.available = Number(product.available);
    console.log(`\r\nproduct.available ${product.available} \r\nstock.available ${stock.available}`);
  } else {
    throw new Error("Insufficient stock");
  }
  return product.save()
    .then((result) => {
      if (!result) throw new Error("Error updating vendor's new product");
      // return result;
      return stock.save()
        .then((outcome) => {
          if (!outcome) throw new Error("Error updating vendor's new product");
          return outcome;
        })
        .catch((err) => { throw err; });
    })
    .catch((err) => { throw err; });
}

/**
 * @description create save a new Product and return it if successful
 * a check is perform to ensure only valid vendors are creating their products
 * the new document is saved on the product collection and also push into products array
 * in vendor collection.
 * @param {Object} req request object
 * @param {Object} res request object
 * @returns {Object} res carry success, data, and message
 */

export async function create(req, res) {
  const data = req.body || {};

  const { userId, userType } = res.locals;
  if (userType !== "vendor") {
    return fail(res, 422, `Only vendors are allowed to add products not ${userType}`);
  }
  // Validate request

  if (!data.name) return fail(res, 422, "Product name can not be empty and must be alphanumeric.");
  if (!data.category) return fail(res, 422, "Product category can not be empty and must be alphanumeric.");
  if (!hasProp(data, "collections")) return fail(res, 422, "Why no collection or main category?");
  if (!data.descriptionShort) return fail(res, 422, "Product description can not be empty and must be alphanumeric.");
  if (!data.price.unitPrice) return fail(res, 422, "Product unit price can not be empty and must be numeric.");

  const vendor = await findVendorById(userId);
  if (hasProp(vendor, "products")) return fail(res, 422, `Unknown vendor ${userId}.`);

  const newObject = {};
  newObject.vendor = userId;
  newObject.category = data.category;
  newObject.collections = data.collections;
  if (data.code) newObject.code = data.code;
  if (data.sku) newObject.sku = data.sku;
  if (data.upc) newObject.upc = data.upc;
  if (data.name) newObject.name = data.name;
  if (data.brand) newObject.brand = data.brand;
  if (data.descriptionColor) newObject.descriptionColor = data.descriptionColor;
  if (data.descriptionUnit) newObject.descriptionUnit = data.descriptionUnit;
  if (data.descriptionLong) newObject.descriptionLong = data.descriptionLong;
  if (data.descriptionShort) newObject.descriptionShort = data.descriptionShort;
  if (data.descriptionTag) newObject.descriptionTag = data.descriptionTag;

  newObject.variety = {};
  if (data.variety.options && typeof data.variety.options === "boolean") {
    newObject.variety.options = data.variety.options;
    if (data.variety.parent) newObject.variety.parent = data.variety.parent;
  } else if (data.variety.options && (data.variety.options).toLowerCase() === "true") {
    newObject.variety.options = true;
    if (data.variety.parent) newObject.variety.parent = data.variety.parent;
  } else if (data.variety.options && (data.variety.options).toLowerCase() === "false") {
    newObject.variety.options = false;
    if (data.variety.parent) newObject.variety.parent = data.variety.parent;
  }

  if (data.variety.options === true && !data.variety.parent) {
    return fail(res, 422, "Enter variety parent name or set options to false.");
  }

  newObject.price = {};
  if (data.price.deal && typeof data.price.deal === "boolean") {
    newObject.price.deal = data.price.deal;
  } else if (data.price.deal && (data.price.deal).toLowerCase() === "true") {
    newObject.price.deal = true;
  } else if (data.price.deal && (data.price.deal).toLowerCase() === "false") {
    newObject.price.deal = false;
  }

  if (data.price.valuation && ((data.price.valuation).toUpperCase() === "LIFO" ||
  (data.price.valuation).toUpperCase() === "FIFO" || (data.price.valuation).toUpperCase() === "AVCO")) {
    newObject.price.valuation = (data.price.valuation).toUpperCase();
  }
  if (data.price.unitPrice && !Number.isNaN(parseFloat(data.price.unitPrice))) {
    newObject.price.unitPrice = parseFloat(data.price.unitPrice, 10);
  }
  if (data.price.costPrice && !Number.isNaN(parseFloat(data.price.costPrice))) {
    newObject.price.costPrice = data.price.costPrice;
  }
  if (data.price.slashPrice && !Number.isNaN(parseFloat(data.price.slashPrice))) {
    newObject.price.slashPrice = data.price.slashPrice;
  }
  if (data.price.discount && !Number.isNaN(parseFloat(data.price.discount))) {
    newObject.price.discount = data.price.discount;
  }
  if (data.price.discountType && ((data.price.discountType).toLowerCase() === "fixed" ||
  (data.price.discountType).toLowerCase() === "percent")) {
    newObject.price.discountType = (data.price.discountType).toLowerCase();
  }
  if (data.price.tax && !Number.isNaN(parseFloat(data.price.tax))) {
    newObject.price.tax = data.price.tax;
  }
  if (data.price.taxType && ((data.price.taxType).toLowerCase() === "fixed" ||
  (data.price.taxType).toLowerCase() === "percent")) {
    newObject.price.taxType = (data.price.taxType).toLowerCase();
  }

  newObject.shippingDetails = {};
  if (data.shippingDetails.cost) newObject.shippingDetails.cost = data.shippingDetails.cost;
  if (data.shippingDetails.weight) {
    newObject.shippingDetails.weight = data.shippingDetails.weight;
  }
  if (data.shippingDetails.length) {
    newObject.shippingDetails.length = data.shippingDetails.length;
  }
  if (data.shippingDetails.width) {
    newObject.shippingDetails.width = data.shippingDetails.width;
  }
  if (data.shippingDetails.height) {
    newObject.shippingDetails.height = data.shippingDetails.height;
  }

  newObject.manufactureDetails = {};
  if (data.manufactureDetails.make) {
    newObject.manufactureDetails.make = data.manufactureDetails.make;
  }
  if (data.manufactureDetails.modelNumber) {
    newObject.manufactureDetails.modelNumber = data.manufactureDetails.modelNumber;
  }
  if (data.manufactureDetails.releaseDate) {
    newObject.manufactureDetails.releaseDate = data.manufactureDetails.releaseDate;
  }

  newObject.download = {};
  if (data.download.downloadable &&
    (typeof data.download.downloadable === "boolean" ||
    (data.download.downloadable).toLowerCase() === "true" ||
    (data.download.downloadable).toLowerCase() === "false")) {
    newObject.download.downloadable = Boolean(data.download.downloadable);
  }
  if (data.download.downloadName) {
    newObject.download.downloadName = data.download.downloadName;
  }

  if (data.extraFields && typeof data.extraFields === "object" && data.extraFields[0].name &&
   data.extraFields[0].value) {
    let fieldName;
    let fieldValue;
    const fieldArray = [];
    data.extraFields.forEach((item, index, array) => {
      if (typeof item === "object" && item.name && item.value) {
        fieldName = data.extraFields[index].name;
        fieldValue = data.extraFields[index].value;
        fieldArray.push({ name: fieldName, value: fieldValue });
      }
    });
    newObject.extraFields = {};
    newObject.extraFields = fieldArray;
  }
  // Create a Product
  const product = new Product(newObject);

  // Save Product in the database
  return product.save()
    .then((result) => {
      if (!result) {
        return fail(res, 404, "Error not found newly added product");
      }
      // <!-- elastic
      result.on("es-indexed", (err) => {
        if (err) console.log(`Error indexing record ${err.message}`);
        console.log("New product index has been created successfully!");
      });
      // elastic --!>
      vendor.products.push(result);
      return vendor.save()
        .then((outcome) => {
          if (!outcome) return fail(res, 404, "Error updating vendor's new product");
          return success(res, 200, result, "New product record has been created successfully!");
        })
        .catch(err => fail(res, 500, `Error occurred while updating vendor's new Product. ${err.message}`));
    })
    .catch(err => fail(res, 500, `Error occurred while creating the Product. ${err.message}`));
}


/**
 * @description findAll retrieves products that meet search creteria
 * Retrieve kinds of products vendor/:vendorDomain/products/kind/:kind?page=0&limit=50
 * kind (optional) = [ deal | feature | popular | latest | normal ]
 * @param {Object} req http request object
 * @param {Object} res http response object
 */
export async function findAll(req, res) {
  const { vendorDomain, kind } = req.params;
  // console.log("\r\n\r\nvendorDomain, kind ", vendorDomain, kind);
  if (!vendorDomain) return fail(res, 422, "Vendor shop has not been specified.");

  let vendorId;

  const vendor = await findVendorByDomain(vendorDomain);

  if (vendor && vendor.id) {
    vendorId = vendor.id;
  } else {
    return fail(res, 422, "Error: unknown vendor.");
  }

  // console.log("\r\n vendor", vendor);
  let page = req.query.page || 0;
  page = Math.max(0, page - 1); // using a zero-based page index for use with skip()
  let limit = req.query.limit || 10; // record size or counts/page to take
  if (Number(req.query.limit) > 10) limit = Number(req.query.limit);
  if (Number(req.query.limit) > 50) limit = 50; // cap on 50 records/page

  const offset = page * limit; // skip number of records

  const today = new Date(Date.now());
  // only docs from the past 30 days
  const dateFloor = (new Date()).setDate(today.getDate() - 30);

  let filter = {
    vendor: vendorId,
  };

  const filter1 = {
    vendor: vendorId,
    createdAt: { $gte: dateFloor },
  };

  const filter2 = {
    vendor: vendorId,
    "analytics.feature": true,
  };

  const filter3 = {
    vendor: vendorId,
    "price.deal": true,
  };

  const filter4 = {
    vendor: {
      $ne: vendorId,
    },
    approved: "pending",
  };

  let sort = { createdAt: -1 };

  switch (kind) {
    case "normal": sort = { createdAt: 1 };
      break;
    case "latest": filter = filter1; sort = { createdAt: -1 };
      break;
    case "popular": sort = { "analytics.viewCount": 1 };
      break;
    case "feature": filter = filter2;
      break;
    case "unapproved": filter = filter4;
      break;
    case "deal": filter = filter3;
      break;
    default: sort = { createdAt: 1 };
  }

  const query = Product
    .find(filter)
    .populate({ path: "review", select: "id subjectId comment rating customer", match: { standing: "active" } })
    .populate({ path: "vendor", select: "id url businessName domainName contractAddress publicAddress" })
    .populate({ path: "brand", select: "id name icon", match: { standing: "active" } })
    .populate({ path: "collections", select: "id name icon", match: { standing: "active" } })
    .populate({ path: "category", select: "id name icon", match: { standing: "active" } })
    .limit(100)
    .sort(sort);

  return query.countDocuments((err, count) => {
    if (err) return fail(res, 500, `Error retrieving product(s).\r\n${err.message}`);
    return query.skip(offset).limit(limit).exec("find", (erro, result) => {
      if (erro) return fail(res, 500, `Error retrieving product(s).\r\n${erro.message}`);
      return success(res, 200, { count, result }, "product(s) retrieved successfully!");
    });
  });
}


/**
 * @description findSome retrieves array of products requested
 * Retrieve multiple products "/products/operations/(:productIds)*"
 * productIds are slashed separated product Ids
 * @param {Object} req http request object
 * @param {Object} res http response object
 */
export async function findSome(req, res) {
  const data = {};
  const productIds = (req.params.productIds).split("/");
  const products = await Promise.all(productIds.map((id, index) => findProductById(id)));
  products.forEach((product, index) => {
    if (hasProp(product, "_id")) {
      data[product._id] = product;
    }
  });

  const size = Object.keys(data).length;
  if (size > 0) return success(res, 200, data, `${size} results retrieved successfully!`);
  return notFound(res, "Error: product(s) not found");
}

/**
 * @description findSimilar retrieves products in the same category with a given one
 * Retrieve multiple products "/products/similar/:productId"
 * @param {Object} req http request object
 * @param {Object} res http response object
 * @returns {Promise}
 */
export async function findSimilar(req, res) {
  const recordId = req.params.productId || "";
  if (!ObjectId.isValid(recordId)) return fail(res, 422, "Invalid record Id as request parameter");

  const product = await findProductById(recordId);

  const newProduct = new Product({ brand: product.brand });
  return newProduct.findSimilarBrands((err, similarBrands) => {
    if (err) console.log(err);
    console.log(similarBrands);
    const size = Object.keys(similarBrands).length;
    if (size > 0) return success(res, 200, similarBrands, `${size} results retrieved successfully!`);
    return notFound(res, "Error: product(s) not found");
  });
}


// Find a single product with a productId vendor
export function findOne(req, res) {
  const productId = req.params.productId || "";

  // Validate request
  if (!productId) return fail(res, 400, "Invalid Product Id as request parameter");

  return Product.findById(productId)
    .populate({
      path: "review",
      select: "id subjectId comment rating customer createdAt",
      match: { standing: "active" },
      populate: {
        path: "customer",
        select: "id username fullname email",
      },
    })
    .populate({ path: "vendor", select: "id url businessName domainName contractAddress" })
    .populate({ path: "brand", select: "id name icon", match: { standing: "active" } })
    .populate({ path: "collections", select: "id name icon", match: { standing: "active" } })
    .populate({ path: "category", select: "id name icon", match: { standing: "active" } })
    .populate({ path: "approval", select: "id reviewer product vendor comment approved standing" })
    .then((result) => {
      if (!result) {
        return fail(res, 404, `Error: product not found with id ${productId}`);
      }
      return success(res, 200, result, "product(s) retrieved successfully!");
    })
    .catch((err) => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return notFound(res, `Error: product not found with id ${productId}.\r\n ${err.message}`);
      }
      return fail(res, 500, `Error retrieving product with id ${productId}.\r\n ${err.message}`);
    });
}

// Patch a product identified by the productId in the request
export function modify(req, res) {
  const productId = req.params.productId || "";
  const data = req.body || {};
  const { userId, userType } = res.locals;
  let vendorId;

  if (userType === "admin") {
    vendorId = userId;
  } else {
    return fail(res, 422, `Only vendors are allowed to add products not ${userType}`);
  }

  // Validate request
  if (!vendorId) return fail(res, 422, "Product vendor can not be empty and must be alphanumeric.");

  if (!data.name) return fail(res, 422, "Product name can not be empty and must be alphanumeric.");

  if (!data.collections) return fail(res, 422, "Product category can not be empty and must be alphanumeric.");

  if (!data.description.long) return fail(res, 422, "Product description can not be empty and must be alphanumeric.");

  if (!data.price.unitPrice) return fail(res, 422, "Product unit price can not be empty and must be numeric.");

  const newObject = {};
  newObject.category = data.category;
  newObject.collections = data.collections;
  if (data.code) newObject.code = data.code;
  if (data.sku) newObject.sku = data.sku;
  if (data.upc) newObject.upc = data.upc;
  if (data.name) newObject.name = data.name;
  if (data.brand) newObject.brand = data.brand;
  if (data.description.color) newObject.description.color = data.description.color;
  if (data.description.unit) newObject.description.unit = data.description.unit;
  if (data.description.long) newObject.description.long = data.description.long;
  if (data.description.short) newObject.description.short = data.description.short;
  if (data.description.tag && typeof data.description.tag === "object") {
    newObject.description.tag = [];
    newObject.description.tag = data.description.tag;
  }


  newObject.variety = {};
  if (data.variety.options && typeof data.variety.options === "boolean") {
    newObject.variety.options = data.variety.options;
    if (data.variety.parent) newObject.variety.parent = data.variety.parent;
  } else if (data.variety.options && (data.variety.options).toLowerCase() === "true") {
    newObject.variety.options = true;
    if (data.variety.parent) newObject.variety.parent = data.variety.parent;
  } else if (data.variety.options && (data.variety.options).toLowerCase() === "false") {
    newObject.variety.options = false;
    if (data.variety.parent) newObject.variety.parent = data.variety.parent;
  }

  if (data.variety.options === true && !data.variety.parent) {
    return fail(res, 422, "Enter variety parent name or set options to false.");
  }

  newObject.price = {};
  if (data.price.deal && typeof data.price.deal === "boolean") {
    newObject.price.deal = data.price.deal;
  } else if (data.price.deal && (data.price.deal).toLowerCase() === "true") {
    newObject.price.deal = true;
  } else if (data.price.deal && (data.price.deal).toLowerCase() === "false") {
    newObject.price.deal = false;
  }

  if (data.price.valuation && ((data.price.valuation).toUpperCase() === "LIFO" ||
  (data.price.valuation).toUpperCase() === "FIFO" || (data.price.valuation).toUpperCase() === "AVCO")) {
    newObject.price.valuation = (data.price.valuation).toUpperCase();
  }
  if (data.price.unitPrice && typeof data.price.unitPrice === "number") {
    newObject.price.unitPrice = data.price.unitPrice;
  }
  if (data.price.costPrice && typeof data.price.costPrice === "number") {
    newObject.price.costPrice = data.price.costPrice;
  }
  if (data.price.slashPrice && typeof data.price.slashPrice === "number") {
    newObject.price.slashPrice = data.price.slashPrice;
  }
  if (data.price.discount && typeof data.price.discount === "number") {
    newObject.price.discount = data.price.discount;
  }
  if (data.price.discountType && ((data.price.discountType).toLowerCase() === "fixed" ||
  (data.price.discountType).toLowerCase() === "percent")) {
    newObject.price.discountType = (data.price.discountType).toLowerCase();
  }
  if (data.price.tax && typeof data.price.tax === "number") {
    newObject.price.tax = data.price.tax;
  }
  if (data.price.taxType && ((data.price.taxType).toLowerCase() === "fixed" ||
  (data.price.taxType).toLowerCase() === "percent")) {
    newObject.price.taxType = (data.price.taxType).toLowerCase();
  }

  newObject.shippingDetails = {};
  if (data.shippingDetails.cost) newObject.shippingDetails.cost = data.shippingDetails.cost;
  if (data.shippingDetails.weight) {
    newObject.shippingDetails.weight = data.shippingDetails.weight;
  }
  if (data.shippingDetails.length) {
    newObject.shippingDetails.length = data.shippingDetails.length;
  }
  if (data.shippingDetails.width) {
    newObject.shippingDetails.width = data.shippingDetails.width;
  }
  if (data.shippingDetails.height) {
    newObject.shippingDetails.height = data.shippingDetails.height;
  }

  newObject.manufactureDetails = {};
  if (propertyExist(data, "manufactureDetails", "make")) {
    newObject.manufactureDetails.make = data.manufactureDetails.make;
  }
  if (propertyExist(data, "manufactureDetails", "modelNumber")) {
    newObject.manufactureDetails.modelNumber = data.manufactureDetails.modelNumber;
  }
  if (propertyExist(data, "manufactureDetails", "releaseDate")) {
    newObject.manufactureDetails.releaseDate = data.manufactureDetails.releaseDate;
  }


  if (data.download.downloadable && typeof data.download.downloadable === "boolean") {
    newObject.download = {};
    newObject.download.downloadable = data.download.downloadable;
    if (data.download.downloadName) newObject.download.downloadName = data.download.downloadName;
  } else if (data.download.downloadable && (data.download.downloadable).toLowerCase() === "true") {
    newObject.download = {};
    newObject.download.downloadable = true;
    if (data.download.downloadName) newObject.download.downloadName = data.download.downloadName;
  } else if (data.download.downloadable && (data.download.downloadable).toLowerCase() === "false") {
    newObject.download = {};
    newObject.download.downloadable = false;
    if (data.download.downloadName) newObject.download.downloadName = data.download.downloadName;
  }


  if (propertyExist(data, "extraFields") && typeof data.extraFields === "object" && propertyExist(data.extraFields[0], "name") &&
  propertyExist(data.extraFields[0], "value")) {
    let fieldName;
    let fieldValue;
    const fieldArray = [];
    data.extraFields.forEach((item, index, array) => {
      if (typeof item === "object" && item.name && item.value) {
        fieldName = data.extraFields[index].name;
        fieldValue = data.extraFields[index].value;
        fieldArray.push({ name: fieldName, value: fieldValue });
      }
    });
    newObject.extraFields = {};
    newObject.extraFields = fieldArray;
  }

  if (propertyExist(data, "action")) {
    newObject.action = data.action;
  }


  newObject.updated = Date.now();

  // Find product and update it with the request body
  return Product.findByIdAndUpdate(productId, newObject, { new: true })
    .then((result) => {
      if (!result) {
        return notFound(res, `Product not found with id ${productId} first`);
      }
      return success(res, 200, result.view(true), "Product deleted successfully!");
    })
    .catch((err) => {
      console.log(err);
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return notFound(res, `Product not found with id ${productId}\r\n${err.message}`);
      }
      return fail(res, 500, `Error updating product with id ${productId}\r\n${err.message}`);
    });
}

// Update a product identified by the productId in the request
export function update(req, res) {
  const productId = req.params.productId || "";
  const data = req.body || {};
  const { userId, userType } = res.locals;
  let vendorId;

  if (userType === "vendor") {
    vendorId = userId;
  } else {
    return fail(res, 422, `Only vendors are allowed to add products not ${userType}`);
  }

  // Validate request
  if (!vendorId) return fail(res, 422, "Product vendor can not be empty and must be alphanumeric.");

  if (!data.name) return fail(res, 422, "Product name can not be empty and must be alphanumeric.");

  if (!data.collections) return fail(res, 422, "Product category can not be empty and must be alphanumeric.");

  if (!data.descriptionLong) return fail(res, 422, "Product description can not be empty and must be alphanumeric.");

  if (!data.price.unitPrice) return fail(res, 422, "Product unit price can not be empty and must be numeric.");

  const newObject = {};
  newObject.vendor = vendorId;
  if (data.code) newObject.code = data.code;
  if (data.sku) newObject.sku = data.sku;
  if (data.upc) newObject.upc = data.upc;
  if (data.name) newObject.name = data.name;
  if (data.brand) newObject.brand = data.brand;
  if (data.collections) newObject.collections = data.collections;
  if (data.category) newObject.category = data.category;
  if (data.brand) newObject.brand = data.brand;
  if (data.descriptionColor) newObject.descriptionColor = data.descriptionColor;
  if (data.descriptionUnit) newObject.descriptionUnit = data.descriptionUnit;
  if (data.descriptionLong) newObject.descriptionLong = data.descriptionLong;
  if (data.descriptionShort) newObject.descriptionShort = data.descriptionShort;
  if (data.descriptionTag) newObject.descriptionTag = data.descriptionTag;

  newObject.variety = {};
  if (data.variety.options && typeof data.variety.options === "boolean") {
    newObject.variety.options = data.variety.options;
    if (data.variety.parent) newObject.variety.parent = data.variety.parent;
  } else if (data.variety.options && (data.variety.options).toLowerCase() === "true") {
    newObject.variety.options = true;
    if (data.variety.parent) newObject.variety.parent = data.variety.parent;
  } else if (data.variety.options && (data.variety.options).toLowerCase() === "false") {
    newObject.variety.options = false;
    if (data.variety.parent) newObject.variety.parent = data.variety.parent;
  }

  if (data.variety.options === true && !data.variety.parent) {
    return fail(res, 422, "Enter variety parent name or set options to false.");
  }

  newObject.price = {};
  if (data.price.deal && typeof data.price.deal === "boolean") {
    newObject.price.deal = data.price.deal;
  } else if (data.price.deal && (data.price.deal).toLowerCase() === "true") {
    newObject.price.deal = true;
  } else if (data.price.deal && (data.price.deal).toLowerCase() === "false") {
    newObject.price.deal = false;
  }

  if (data.price.valuation && ((data.price.valuation).toUpperCase() === "LIFO" ||
  (data.price.valuation).toUpperCase() === "FIFO" || (data.price.valuation).toUpperCase() === "AVCO")) {
    newObject.price.valuation = (data.price.valuation).toUpperCase();
  }
  if (data.price.unitPrice && typeof data.price.unitPrice === "number") {
    newObject.price.unitPrice = data.price.unitPrice;
  }
  if (data.price.costPrice && typeof data.price.costPrice === "number") {
    newObject.price.costPrice = data.price.costPrice;
  }
  if (data.price.slashPrice && typeof data.price.slashPrice === "number") {
    newObject.price.slashPrice = data.price.slashPrice;
  }
  if (data.price.discount && typeof data.price.discount === "number") {
    newObject.price.discount = data.price.discount;
  }
  if (data.price.discountType && ((data.price.discountType).toLowerCase() === "fixed" ||
  (data.price.discountType).toLowerCase() === "percent")) {
    newObject.price.discountType = (data.price.discountType).toLowerCase();
  }
  if (data.price.tax && typeof data.price.tax === "number") {
    newObject.price.tax = data.price.tax;
  }
  if (data.price.taxType && ((data.price.taxType).toLowerCase() === "fixed" ||
  (data.price.taxType).toLowerCase() === "percent")) {
    newObject.price.taxType = (data.price.taxType).toLowerCase();
  }

  newObject.shippingDetails = {};
  if (data.shippingDetails.cost) newObject.shippingDetails.cost = data.shippingDetails.cost;
  if (data.shippingDetails.weight) {
    newObject.shippingDetails.weight = data.shippingDetails.weight;
  }
  if (data.shippingDetails.length) {
    newObject.shippingDetails.length = data.shippingDetails.length;
  }
  if (data.shippingDetails.width) {
    newObject.shippingDetails.width = data.shippingDetails.width;
  }
  if (data.shippingDetails.height) {
    newObject.shippingDetails.height = data.shippingDetails.height;
  }

  newObject.manufactureDetails = {};
  if (data.manufactureDetails.make) {
    newObject.manufactureDetails.make = data.manufactureDetails.make;
  }
  if (data.manufactureDetails.modelNumber) {
    newObject.manufactureDetails.modelNumber = data.manufactureDetails.modelNumber;
  }
  if (data.manufactureDetails.releaseDate) {
    newObject.manufactureDetails.releaseDate = data.manufactureDetails.releaseDate;
  }


  if (data.download.downloadable && typeof data.download.downloadable === "boolean") {
    newObject.download = {};
    newObject.download.downloadable = data.download.downloadable;
    if (data.download.name) newObject.download.name = data.download.name;
  } else if (data.download.downloadable && (data.download.downloadable).toLowerCase() === "true") {
    newObject.download = {};
    newObject.download.downloadable = true;
    if (data.download.name) newObject.download.name = data.download.name;
  } else if (data.download.downloadable && (data.download.downloadable).toLowerCase() === "false") {
    newObject.download = {};
    newObject.download.downloadable = false;
    if (data.download.name) newObject.download.name = data.download.name;
  }

  if (data.extraFields && typeof data.extraFields === "object" && data.extraFields[0].name &&
   data.extraFields[0].value) {
    let fieldName;
    let fieldValue;
    const fieldArray = [];
    data.extraFields.forEach((item, index, array) => {
      if (typeof item === "object" && item.name && item.value) {
        fieldName = data.extraFields[index].name;
        fieldValue = data.extraFields[index].value;
        fieldArray.push({ name: fieldName, value: fieldValue });
      }
    });
    newObject.extraFields = {};
    newObject.extraFields = fieldArray;
  }

  newObject.updated = Date.now();

  // Find product and update it with the request body
  return Product.findByIdAndUpdate(productId, newObject, { new: true })
    .then((result) => {
      if (!result) {
        return notFound(res, `Product not found with id ${productId} first`);
      }
      return success(res, 200, result, "Product deleted successfully!");
    }).catch((err) => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return notFound(res, `Product not found with id ${productId}\r\n${err.message}`);
      }
      return fail(res, 500, `Error updating product with id ${productId}\r\n${err.message}`);
    });
}

// Approval by Admin to overide crowd-approval vendors
export async function approval(req, res) {
  const recordId = req.params.productId || "";
  const data = req.body || {};
  const { userId, userType } = res.locals;
  let vendorId;
  const newObject = {};

  if (userType === "vendor") {
    vendorId = userId;
  } else {
    return fail(res, 422, `Only vendors are allowed to approval products not ${userType}`);
  }

  // Validate request
  if (!vendorId) return fail(res, 422, "Product vendor cannot be empty and must be alphanumeric.");
  if (!ObjectId.isValid(recordId)) return fail(res, 422, "Invalid record Id as request parameter");
  if (!data.approval) return fail(res, 422, "Product vendor cannot be empty and must be alphanumeric.");
  if (!data.approval.approved) return fail(res, 422, "Product vendor cannot be empty and must be alphanumeric.");
  if (!["pending", "accepted", "rejected"].includes(data.approval.approved)) {
    return fail(res, 422, `product approval is either "accepted" or "rejected", not "${data.approval.approved}".`);
  }
  const product = await findProductById(recordId);
  if (product.vendor === vendorId) {
    return fail(res, 422, "A vendor cannot approve her product.");
  }

  newObject.approvalAdmin = {};
  if (data.approval.approved !== "accepted" && !(data.approval.comment).toString().length > 50) {
    return fail(res, 422, "State reason(s) for not granting this product approval (50 characters text)!");
  }
  if (data.approval.approved) {
    newObject.approvalAdmin.approved = data.approval.approved;
    newObject.approved = data.approval.approved;
  }
  if (data.approval.approvedBy) {
    newObject.approvalAdmin.approvedBy = data.approval.approvedBy;
  }
  if (data.approval.comment) {
    newObject.approvalAdmin.comment = data.approval.comment;
  }

  // Find product and update it with the request body
  return Product.findByIdAndUpdate(recordId, newObject, { new: true })
    .then((result) => {
      if (!result) {
        return notFound(res, `Product not found with id ${recordId} first`);
      }
      return success(res, 200, result.view(true), "Product deleted successfully!");
    }).catch((err) => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return notFound(res, `Product not found with id ${recordId}\r\n${err.message}`);
      }
      return fail(res, 500, `Error updating product with id ${recordId}\r\n${err.message}`);
    });
}

// Delete a product with the specified productId in the request
export async function destroy(req, res) {
  const recordId = req.params.productIds || "";
  const { userId, userType, userRole } = res.locals;
  if (!recordId) return fail(res, 400, "No record Id as request parameter");
  if (!ObjectId.isValid(recordId)) return fail(res, 422, "Invalid record Id as request parameter");
  if (!userId || !userType || !userRole) return fail(res, 400, "Invalid authentication credentials");

  if ((userType === "admin" && userRole === "super") || userType === "vendor") {
    // we are cool!
  } else {
    return fail(res, 422, `Only Super Admin and Vendors are allowed to delete record not ${userRole}`);
  }

  let product = {};
  let Vendor = {};
  let vendorId;
  try {
    const productDoc = await findProductById(recordId) ; // eslint-disable-line
    if (!hasProp(productDoc, "_doc")) return fail(res, 422, "productDoc not found!");
    product = productDoc._doc; // eslint-disable-line
    if (!hasProp(product, "vendor")) return fail(res, 422, "Product vendor not found!");
    Vendor = product.vendor;
    if (!hasProp(Vendor, "_id")) return fail(res, 422, "Product vendor not found!");
    vendorId = Vendor._id;
    if (!ObjectId.isValid(vendorId)) return fail(res, 422, "Product vendor not found!");
  } catch (err) {
    console.log(`Error findProductById(recordId) ${err.message}`);
    return fail(res, 422, `Error findProductById(recordId) ${err.message}`);
  }

  if (userRole === "super" || vendorId === userId) {
    // Ok
  } else {
    return fail(res, 422, "Only product owners are allowed to delete their product.");
  }
  let order;
  try {
    order = await findOneOrderProduct(recordId);
  } catch (err) {
    console.log(`Error findOneOrderProduct(recordId) ${err.message}`);
  }

  if (order) return fail(res, 422, `Cannot delete product under transaction ${order}`);
  let products;
  try {
    Vendor = await findVendorById(vendorId);
    if (!hasProp(Vendor, "products")) return fail(res, 422, "Vendor's Product array not found!");
    products = Vendor.products || {};
  } catch (err) {
    console.log(`Error findVendorById(userId) ${err.message}`);
  }

  return Product.findByIdAndRemove(recordId)
    .then((record) => {
      if (!record) return notFound(res, `Record not found with id ${recordId}`);
      record.on("es-removed", (err, result) => {
        if (err) console.log(`Error removing index ${err.message}`);
        /* Docuemnt is unindexed */
      });
      // Remove item from product array if it exist
      Vendor.products = products.filter(e => e !== recordId);
      return Vendor.save()
        .then((outcome) => {
          if (!outcome) return fail(res, 404, "Error deleting vendor's product");
          return success(res, 200, [], "Record deleted successfully!");
        })
        .catch(err => fail(res, 500, `Error occurred while deleting vendor's product.\r\n${err.message}`));
    })
    .catch((err) => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return notFound(res, `Error: record not found with id ${recordId}\r\n${err.message}`);
      }
      return fail(res, 500, `Error: could not delete record with id ${recordId}\r\n${err.message}`);
    });
}


// ///////////////////////////////////////////////////
// Analytics
// //////////////////////////////////////////////////

/**
 * @description countProduct counts the exact number of products
 * @param {String} id product id of the product to be counted
 * @param {Object} condition filter query for products to be counted
 * @returns {Promise} count ot products.
 */
export function countProduct(condition = {}) {
  return new Promise((resolve, reject) => Product
    .countDocuments(condition)
    .exec((err, result) => {
      if (!err) resolve(result);
      reject(err);
    }));
}

