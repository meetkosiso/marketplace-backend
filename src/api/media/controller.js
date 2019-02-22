/**
 * @author Odewale Ifeoluwa
 */
// import Jimp from "jimp";
// import fs from "fs";
import Jimp from "jimp";
import Media, { ObjectId } from "./model";
import { success, fail, notFound } from "./../../services/response";
import FileSys from "./../../services/helpers/FileSystem";
import * as helper from "./../../services/helpers";
import Product from "../product/model";
import Category from "../category/model";
import Collections from "../collection/model";
import Brand from "../brand/model";
import Slider from "../slider/model";
import Blog from "../blog/model";
import Vendor from "../vendor/model";
import Customer from "../customer/model";
import Currency from "../currency/model";
// Create and Save a new record
export function create(req, res) {
  const data = req.body || {};
  const { userId, userType } = res.locals;
  let vendorId;

  if (userType === "vendor") {
    vendorId = userId;
  } else {
    return fail(res, 422, `Only vendors are allowed to add media not ${userType}`);
  }

  // Validate request
  if (!data.media_type) return fail(res, 422, "media type can not be empty and must be alphanumeric.");
  if (!data.vendor) return fail(res, 422, "vendor can not be empty and must be alphanumeric.");
  if (!data.purpose) return fail(res, 422, 'purpose can not be empty and must be either "slide", "picture", "banner", "background"');

  const newObject = {};
  newObject.vendor = vendorId;
  if (data.vendor) newObject.vendor = data.vendor;
  if (data.purpose) newObject.purpose = data.purpose;

  newObject.page = {};
  if ((data.page.product && typeof data.page.product === "boolean") ||
  (data.page.product).toLowerCase() === "true" ||
  (data.page.product).toLowerCase() === "true") {
    newObject.page.product = data.page.product;
  }
  if ((data.page.stock && typeof data.page.stock === "boolean") ||
  (data.page.stock).toLowerCase() === "true" ||
  (data.page.stock).toLowerCase() === "true") {
    newObject.page.stock = data.page.stock;
  }
  if ((data.page.vendor && typeof data.page.vendor === "boolean") ||
  (data.page.vendor).toLowerCase() === "true" ||
  (data.page.vendor).toLowerCase() === "true") {
    newObject.page.vendor = data.page.vendor;
  }
  if ((data.page.brand && typeof data.page.brand === "boolean") ||
  (data.page.brand).toLowerCase() === "true" ||
  (data.page.brand).toLowerCase() === "true") {
    newObject.page.brand = data.page.brand;
  }
  if ((data.page.category && typeof data.page.category === "boolean") ||
  (data.page.category).toLowerCase() === "true" ||
  (data.page.category).toLowerCase() === "true") {
    newObject.page.category = data.page.category;
  }
  if ((data.page.blog && typeof data.page.blog === "boolean") ||
  (data.page.blog).toLowerCase() === "true" ||
  (data.page.blog).toLowerCase() === "true") {
    newObject.page.blog = data.page.blog;
  }

  if (data.place) newObject.place = data.place;
  if (data.num) newObject.num = data.num;
  if (data.url) newObject.url = data.url;
  if (data.title) newObject.title = data.title;
  if (data.description) newObject.description = data.description;
  if (data.style) newObject.style = data.style;

  // Create a Media
  const media = new Media(newObject);

  // Save Product in the database
  return media.save()
    .then((result) => {
      if (!result) return notFound(res, "Error: newly submitted record not found");
      return success(res, 200, result, "New record has been created successfully!");
    })
    .catch(err => fail(res, 500, `Error creating record.\r\n${err.message}`));
}


// Retrieve and return all records from the database.
export function findAll(req, res) {
  return Media.find()
    .then(result => success(res, 200, result, "retrieving record(s) was successfully!"))
    .catch(err => fail(res, 500, `Error retrieving record(s).\r\n${err.message}`));
}

// Retrieve a single record with a given recordId
export function findOne(req, res) {
  const recordId = req.params.mediaId || "";
  if (!recordId) return fail(res, 400, "No record Id as request parameter");
  if (!ObjectId.isValid(recordId)) return fail(res, 422, "Invalid record Id as request parameter");
  return Media.findById(recordId)
    .then((result) => {
      if (!result) return notFound(res, 404, "Error record not found.");
      return success(res, 200, result, "retrieving record was successfully!");
    }).catch((err) => {
      if (err.kind === "ObjectId") {
        notFound(res, 404, `Error retrieving record.\r\n${err.message}`);
      }
      return fail(res, 500, `Error retrieving record.\r\n${err.message}`);
    });
}

// Update a media identified by the mediaId in the request
export function update(req, res) {
  const recordId = req.params.mediaId || "";
  if (!recordId) return fail(res, 400, "No record Id as request parameter");
  if (!ObjectId.isValid(recordId)) return fail(res, 422, "Invalid record Id as request parameter");
  const data = req.body || {};
  const { userId, userType } = res.locals;
  let vendorId;

  if (userType === "vendor") {
    vendorId = userId;
  } else {
    return fail(res, 422, `Only vendors are allowed to add media not ${userType}`);
  }

  const newObject = {};
  newObject.vendor = vendorId;
  if (data.vendor) newObject.vendor = data.vendor;
  if (data.purpose) newObject.purpose = data.purpose;

  newObject.page = {};
  if ((data.page.product && typeof data.page.product === "boolean") ||
  (data.page.product).toLowerCase() === "true" ||
  (data.page.product).toLowerCase() === "false") {
    newObject.page.product = data.page.product;
  }
  if ((data.page.stock && typeof data.page.stock === "boolean") ||
  (data.page.stock).toLowerCase() === "true" ||
  (data.page.stock).toLowerCase() === "false") {
    newObject.page.stock = data.page.stock;
  }
  if ((data.page.vendor && typeof data.page.vendor === "boolean") ||
  (data.page.vendor).toLowerCase() === "true" ||
  (data.page.vendor).toLowerCase() === "false") {
    newObject.page.vendor = data.page.vendor;
  }
  if ((data.page.brand && typeof data.page.brand === "boolean") ||
  (data.page.brand).toLowerCase() === "true" ||
  (data.page.brand).toLowerCase() === "false") {
    newObject.page.brand = data.page.brand;
  }
  if ((data.page.category && typeof data.page.category === "boolean") ||
  (data.page.category).toLowerCase() === "true" ||
  (data.page.category).toLowerCase() === "false") {
    newObject.page.category = data.page.category;
  }
  if ((data.page.blog && typeof data.page.blog === "boolean") ||
  (data.page.blog).toLowerCase() === "true" ||
  (data.page.blog).toLowerCase() === "false") {
    newObject.page.blog = data.page.blog;
  }

  if (data.place) newObject.place = data.place;
  if (data.num) newObject.num = data.num;
  if (data.url) newObject.url = data.url;
  if (data.title) newObject.title = data.title;
  if (data.description) newObject.description = data.description;
  if (data.style) newObject.style = data.style;

  // Create a Media
  const media = new Media(newObject);

  // Find media and update it with the request body
  return Media.findByIdAndUpdate(recordId, media, { new: true })
    .then((result) => {
      if (!result) return notFound(res, "Error: newly submitted record not found");
      return success(res, 200, result, "New record has been created successfully!");
    })
    .catch(err => fail(res, 500, `Error creating record.\r\n${err.message}`));
}

// The function that handle the upload of picture to Google Bucket
function updateImageUpload(Collection, req, res, collectionType, arr = false) {
// Get the document of the collection by id
  return Collection.findById(req.params.mediaId)
    .then((collection) => {
      // check if the document exit in the collection
      if (!collection) {
        // if the document doec not exit return collectionType not found
        return fail(res, 422, `${collectionType} with id ${req.params.mediaId} does not exist`);
      }
      // if it document exist
      // get the data url extension
      const imageExtension = FileSys.getBase64Extension(req.body.src);
      // If the extension is either png or jpeg then run
      // the data url
      if (["png", "jpeg"].indexOf(imageExtension) > -1) {
        // Jimp module is used to process the data url
        const filename = `/images/media/${req.params.mediaId}${FileSys.generateRandomFilename(imageExtension)}`;
        // Check if the property has parent
        // by checking if | exist in the name
        // If there is parent split the names
        const url = `https://storage.googleapis.com/${FileSys.getGoogleBucketName()}${FileSys.getCloudUploadOptions(filename, {}).destination}`;

        const names = req.body.label.split("|");
        const value = arr === false ? url : [url];
        return FileSys.saveFile(req.body.src, filename, imageExtension)
          .then(() => {
            console.log(names);
            // assign the file url to the feild of the document
            if (collectionType.toLowerCase() === "slider") {
              collection.elements[names[1]].title = req.body.title;
              collection.elements[names[1]].subtitle = req.body.subtitle;
            }
            let prevImg = null;
            switch (names.length) {
              case 1:
                if (helper.propertyExist(collection, names[0])) {
                  prevImg = collection[names[0]].startsWith("https://storage.googleapis.com") ? collection[names[0]] : null;
                }
                collection[names[0]] = value;
                break;
              case 2:
                if (helper.propertyExist(collection, names[1], names[0])) {
                  prevImg = collection[names[1]][names[0]].startsWith("https://storage.googleapis.com") ? collection[names[1]][names[0]] : null;
                }
                collection[names[1]][names[0]] = value;
                break;
              case 3:
                if (helper.propertyExist(collection, names[2], names[1], names[0])) {
                  prevImg = collection[names[2]][names[1]][names[0]].startsWith("https://storage.googleapis.com") ? collection[names[2]][names[1]][names[0]] : null;
                }
                collection[names[2]][names[1]][names[0]] = value;
                break;
              default:
                return fail(res, 422, "You have not specify the image");
            }
            // save the collection with the updated document
            if (prevImg !== null) {
              const newPrevImg = prevImg.replace(`https://storage.googleapis.com/${FileSys.getGoogleBucketName()}/`, "");
              FileSys.remove(newPrevImg);
            }
            console.log(value);
            return collection.save()
              .then((data) => {
                if (!data) return fail(res, 404, "There was as error saving the image data");
                // return the new updated document
                return success(res, 200, data, "Image successfully uploaded");
              })
              .catch((err) => {
                // if there is an error saving the document
                // return the following feedback
                if (err.kind === "ObjectId") {
                  return notFound(res, "There was an error saving image object kinf");
                }
                return fail(res, 500, "There was as error saving the image catching things");
              });
          })
          .catch((err) => {
            console.log(err);
            return fail(res, 500, "Image Fail to Upload");
          });
      }
      // it the file is not either jpeg or png return
      return fail(res, 422, "only png, jpg and jpeg are allowed");
    }).catch((err) => {
      if (err.kind === "ObjectId") {
        return notFound(res, `${collectionType} not found with id ${req.params.mediaId}`);
      }
      return fail(res, 500, `Error retrieving ${collectionType.toLowerCase()} with id ${req.params.mediaId}`);
    });
}


// Later Offline use
// The function that handle the upload of picture to local server
function updateImageUploadLocal(Collection, req, res, collectionType, arr = false) {
  // Get the document of the collection by id
  return Collection.findById(req.params.mediaId)
    .then((collection) => {
      // check if the document exit in the collection
      if (!collection) {
        // if the document doec not exit return collectionType not found
        return fail(res, 422, `${collectionType} with id ${req.params.mediaId} does not exist`);
      }
      // if it document exist
      // get the data url extension
      const imageExtension = FileSys.getBase64Extension(req.body.src);
      // If the extension is either png or jpeg then run
      // the data url
      if (["png", "jpeg"].indexOf(imageExtension) > -1) {
        // Jimp module is used to process the data url
        return Jimp.read(Buffer.from(req.body.src.replace(/^data:image\/(png|jpeg);base64,/, ""), "base64"))
          .then((image) => {
            // console.log(FileSys.getGoogleBucketName());

            let filename = `/images/media/${req.params.mediaId}`;
            filename += `${FileSys.generateRandomFilename(imageExtension)}`;
            // create the filename
            // Reduce the size of the image and save using the above file name
            image.quality(60)
              .write(`public${filename}`);
            // Check if the property has parent
            // by checking if | exist in the name
            // If there is parent split the names
            const url = `${process.env.API_URL}${filename}`;

            const names = req.body.label.split("|");
            const value = arr === false ? url : [url];
            if (collectionType.toLowerCase() === "slider") {
              collection.elements[names[1]].title = req.body.title;
              collection.elements[names[1]].subtitle = req.body.subtitle;
            }
            switch (names.length) {
              case 1:
                collection[names[0]] = value;
                break;
              case 2:
                collection[names[1]][names[0]] = value;
                break;
              case 3:
                collection[names[2]][names[1]][names[0]] = value;
                break;
              default:
                return fail(res, 422, "You have not specify the image");
            }
            return collection.save()
              .then((data) => {
                if (!data) return fail(res, 500, "There was as error saving the image");
                // return the new updated document
                return success(res, 200, data, "Image successfully uploaded");
              })
              .catch((err) => {
                // if there is an error saving the document
                // return the following feedback
                if (err.kind === "ObjectId") {
                  return notFound(res, "There was an error saving image");
                }
                return fail(res, 500, "There was as error saving the image");
              });
          })
          .catch(err => fail(res, 500, `Image Fail to Upload ${err}`));
      }
      // it the file is not either jpeg or png return
      return fail(res, 422, "only png, jpg and jpeg are allowed");
    }).catch((err) => {
      if (err.kind === "ObjectId") {
        return notFound(res, `${collectionType} not found with id ${req.params.mediaId}`);
      }
      return fail(res, 500, `Error retrieving ${collectionType.toLowerCase()}
        with id ${req.params.mediaId}`);
    });
}


function updateSliderImageData(Collection, req, res, collectionType) {
  return Collection.findById(req.params.mediaId)
    .then((collection) => {
      // check if the document exit in the collection
      if (!collection) {
        // if the document doec not exit return collectionType not found
        return fail(res, 422, `${collectionType} with id ${req.params.mediaId} does not exist`);
      }

      const names = req.body.label.split("|");
      if (collectionType.toLowerCase() === "slider") {
        collection.elements[names[1]].title = req.body.title;
        collection.elements[names[1]].subtitle = req.body.subtitle;
      }
      return collection.save()
        .then((data) => {
          if (!data) return fail(res, 500, "There was as error saving the image");
          // return the new updated document
          return success(res, 200, data, "Slider Image Data successfully updated");
        })
        .catch((err) => {
          // if there is an error saving the document
          // return the following feedback
          if (err.kind === "ObjectId") {
            return notFound(res, "There was an error updating slider image data");
          }
          return fail(res, 500, "There was as error updating slider image data");
        });
    }).catch((err) => {
      if (err.kind === "ObjectId") {
        return notFound(res, `${collectionType} not found with id ${req.params.mediaId}`);
      }
      return fail(res, 500, `Error retrieving ${collectionType.toLowerCase()} with id ${req.params.mediaId}`);
    });
}

export function updateImg(req, res) {
  const { userId, userType } = res.locals;
  let vendorId;

  if (userType === "vendor" || userType === "admin") {
    vendorId = userId;
  } else {
    return fail(res, 422, `Only vendors are allowed to add media not ${userType}`);
  }
  if (!ObjectId.isValid(vendorId)) return fail(res, 422, "Invalid vendor Id as request parameter");

  if (!req.body.collection) {
    return fail(res, 422, "You have not specify where to load the image");
  }
  if (!(["product", "category", "brand", "slider", "vendor", "blog", "customer", "currency", "collection"].indexOf(req.body.collection) >= 0)) {
    return fail(res, 422, "subject must be either of product, category, brand, slider, vendor, blog, currency, or customer, collection");
  }

  switch (req.body.collection) {
    case "product":
      return updateImageUpload(Product, req, res, "Product");
    case "category":
      return updateImageUpload(Category, req, res, "Category");
    case "collection":
      return updateImageUpload(Collections, req, res, "Collection");
    case "brand":
      return updateImageUpload(Brand, req, res, "Brand");
    case "slider":
      if (req.body.src !== "") {
        return updateImageUpload(Slider, req, res, "Slider");
      }
      return updateSliderImageData(Slider, req, res, "Slider");
    case "blog":
      return updateImageUpload(Blog, req, res, "Blog");
    case "currency":
      return updateImageUpload(Currency, req, res, "Currency");
    case "vendor":
      return updateImageUpload(Vendor, req, res, "Vendor");
    case "customer":
      return updateImageUpload(Customer, req, res, "Customer");
    default:
      return notFound(res, "image collection does not exist");
  }
}


// Delete a media with the specified mediaId in the request
export async function destroy(req, res) {
  const recordId = req.params.mediaId || "";
  if (!recordId) return fail(res, 400, "No record Id as request parameter");
  if (!ObjectId.isValid(recordId)) return fail(res, 422, "Invalid record Id as request parameter");
  return Media.findByIdAndRemove(recordId)
    .then((record) => {
      if (!record) return notFound(res, `Record not found with id ${recordId}`);
      return success(res, 200, [], "Record deleted successfully!");
    })
    .catch((err) => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return notFound(res, `Error: record not found with id ${recordId}\r\n${err.message}`);
      }
      return fail(res, 500, `Error: could not delete record with id ${recordId}\r\n${err.message}`);
    });
}
