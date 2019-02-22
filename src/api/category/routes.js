/*
*/

import { Router } from "express";
import * as category from "./controller";
import { isValidVendor, isValidAdmin } from "../auth/controller";
import { initCategory } from "./init";


const router = new Router();

router.get("/init/category", initCategory);

router.get("/categories/search", category.findAll);
/**
 * @api {post} /categories Create category
 * @apiName CreateCategory
 * @apiGroup Category
 * @apiParam {String} access_token master access token.
 * @apiParam {String} name name of category
 * @apiParam {String} description category description
 * @apiParam {String} kind category type (digital/physical)
 * @apiParam {String} icon category icon
 * @apiParam {String} banner category banner
 * @apiParam {String} parent parent category
 * @apiParam {Schema.Types.ObjectId} vendor  vendor that created category
 * @apiParam {Number} view_count number of views
 * @apiParam {String} standing status of category (active/suspended/trashed)
 * @apiParam {Date} updated date of last update
 * @apiSuccess {Object} Category Category's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Category not found.
 * @apiError 401 master access only.
 */
router.post("/categories/vendor/category", isValidVendor, category.create);
router.post("/categories/admin/category", isValidAdmin, category.create);

/**
 * @api {get} /categories/vendor/:vendorDomain Retrieve categories according to vendor
 * @apiName RetrieveVendorCategories
 * @apiGroup Category
 * @apiParam {String} vendorDomain vendor domain name
 * @apiSuccess {Object[]} rows List of Categorys.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get("/categories/vendor/:vendorDomain", category.findVendorCategories);

/**
 * @api {get} /categories/admin Retrieve all categoriesby admin
 * @apiName RetrieveAllCategories
 * @apiGroup Category
 * @apiSuccess {Object[]} rows List of Categorys.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get("/categories/admin", isValidAdmin, category.findAll);


/**
 * @api {get} /categories/:categoryId Retrieve category
 * @apiName RetrieveCategory
 * @apiGroup Category
 * @apiParam categoryId category's Id
 * @apiSuccess {Object} category Category's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Category not found.
 */
router.get("/categories/:categoryId", category.findOne);

/**
 * @api {put} /categories/vendor/:categoryId create sub category by vendor
 * @apiName CreateVendorCategory
 * @apiGroup Category
 * @apiPermission master
 * @apiParam {String} access_token master access token.
 * @apiParam {String} name name of category
 * @apiParam {String} description category description
 * @apiParam {String} kind category type (digital/physical)
 * @apiParam {String} icon category icon
 * @apiParam {String} banner category banner
 * @apiParam {String} parent parent category
 * @apiParam {Schema.Types.ObjectId} vendor vendor that created category
 * @apiParam {Number} view_count number of views
 * @apiParam {String} standing status of category (active/suspended/trashed)
 * @apiParam {Date} updated date of last update
 * @apiSuccess {Object} category Category's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Category not found.
 * @apiError 401 master access only.
 */
router.put("/categories/vendor/:categoryId", isValidVendor, category.update);

/**
 * @api {put} /categories/admin/:categoryId create main category by admin
 * @apiName CreateAdminCategory
 * @apiGroup Category
 * @apiPermission master
 * @apiParam {String} access_token master access token.
 * @apiParam {String} name name of category
 * @apiParam {String} description category description
 * @apiParam {String} kind category type (digital/physical)
 * @apiParam {String} icon category icon
 * @apiParam {String} banner category banner
 * @apiParam {String} parent parent category
 * @apiParam {Schema.Types.ObjectId} vendor vendor that created category
 * @apiParam {Number} view_count number of views
 * @apiParam {String} standing status of category (active/suspended/trashed)
 * @apiParam {Date} updated date of last update
 * @apiSuccess {Object} category Category's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Category not found.
 * @apiError 401 master access only.
 */
router.put("/categories/admin/:categoryId", isValidAdmin, category.update);

/**
 * @api {patch} /categories/:categoryId Modify category status by admin
 * @apiName ModifyCategory
 * @apiGroup Category
 * @apiPermission master
 * @apiParam {String} categoryId category's Id
 * @apiParam {Number} view_count number of views
 * @apiParam {String} standing status of category (active/suspended/trashed)
 * @apiParam {Date} updated date of last update
 * @apiSuccess {Object} category Category's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Category not found.
 * @apiError 401 master access only.
 */
router.patch("/categories/:categoryId", isValidAdmin, category.modify);

/**
 * @api {delete} /categories/:categoryId Delete category
 * @apiName DeleteCategory
 * @apiGroup Category
 * @apiPermission master
 * @apiParam access_token master access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Category not found.
 * @apiError 401 master access only.
 */
router.delete("/categories/:categoryId", isValidVendor, category.destroy);

/**
 * @api {delete} /categories/admin/:categoryIds(*) Delete array of category by Admin
 * @apiName DeleteCategoryArray
 * @apiGroup Category
 * @apiPermission master
 * @apiParam {String} categoryIds slash-separated arrays of Ids
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Category not found.
 * @apiError 401 master access only.
 */
router.delete("/categories/admin/:categoryId(*)", isValidAdmin, category.destroy);


export default router;
