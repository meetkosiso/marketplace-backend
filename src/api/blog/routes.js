
import express from "express";
import * as blog from "./controller";
import { isValidVendor, isValidAdmin } from "../auth/controller";
import { initBlog } from "./init";

const router = express.Router();

router.get("/init/blog", initBlog);

router.get("/blogs/search", blog.search);

/**
 * @api {post} /blogs Create blog
 * @apiName CreateBlog
 * @apiGroup Blog
 * @apiParam {String} access_token master access token.
 * @apiParam {String} kind  Blog type
 * @apiParam {String} title  Blog title
 * @apiParam {String} summary  Blog summary
 * @apiParam {Schema.Types.ObjectId} vendor Vendor that created the blog post
 * @apiParam {String} content  Blog content
 * @apiParam {Array} tag Blog tags
 * @apiParam {String} image  Blog image
 * @apiParam {Number} viewCount Number of views
 * @apiParam {String} standing  Blog status
 * @apiParam {Date} updated Date of last update
 * @apiSuccess {Object} blog Blog's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Blog not found.
 * @apiError 401 master access only.
 */
router.post("/blogs", isValidVendor, blog.create);

/**
* @api {get} /blogs/vendor/:vendorDomain Retrieve blogs by vendor
* @apiName RetrieveBlogs
* @apiGroup Blog
* @description Non-Auth route. Users can view vendors posts
* @apiSuccess {Object[]} rows List of Blogs.
* @apiError {Object} 400 Some parameters may contain invalid values.
*/
router.get("/blogs/vendor/:vendorDomain", blog.findVendorBlogs);
/**
* @api {get} /blogs/admin Retrieve blogs by Admin
* @apiName RetrieveBlogs
* @apiGroup Blog
* @description Non-Auth route. Admin can view all vendors posts
* @apiSuccess {Object[]} rows List of Blogs.
* @apiError {Object} 400 Some parameters may contain invalid values.
*/
router.get("/blogs/admin", isValidAdmin, blog.findAll);


/**
 * @api {get} /blogs/:blogIdRetrieve blog
 * @apiName RetrieveBlog
 * @apiGroup Blog
 * @apiSuccess {Object} blog Blog's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Blog not found.
 */
router.get("/blogs/:blogId", blog.findOne);

/**
 * @api {put} /blogs/:id Update blog
 * @apiName UpdateBlog
 * @apiGroup Blog
 * @apiPermission master
 * @apiParam {String} access_token master access token.
 * @apiParam {String} kind  Blog type
 * @apiParam {String} title  Blog title
 * @apiParam {String} summary  Blog summary
 * @apiParam {Schema.Types.ObjectId} vendor  Vendor that created the blog post
 * @apiParam {String} content  Blog content
 * @apiParam {Array} tag Blog tags
 * @apiParam {String} image  Blog image
 * @apiParam {Number} viewCount Number of views
 * @apiParam {String} standing  Blog status
 * @apiParam {Date} updated Date of last update
 * @apiSuccess {Object} blog Blog's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Blog not found.
 * @apiError 401 master access only.
 */
router.put("/blogs/:blogId", isValidVendor, blog.update);

/**
 * @api {put} /blogs/:blogId Modify a blog status
 * @apiName ModifyBlog
 * @apiGroup Blog
 * @apiPermission master
 * @description a reported blog can be suspended
 * @apiParam {String} access_token master access token.
 * @apiParam {Number} viewCount Number of views
 * @apiParam {String} standing  Blog status
 * @apiParam {Date} updated Date of last update
 * @apiSuccess {Object} blog Blog's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Blog not found.
 * @apiError 401 master access only.
 */
router.patch("/blog/:blogId", isValidAdmin, blog.modify);

/**
 * @api {delete} /blogs/:id Delete blog
 * @apiName DeleteBlog
 * @apiGroup Blog
 * @apiPermission master
 * @apiParam  access_token master access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Blog not found.
 * @apiError 401 master access only.
 */
router.delete("/blogs/:blogId", isValidVendor, blog.destroy);
/**
 * @api {delete} /blogs/admin/:blogIds(*)" Delete array of blogs by Admin
 * @apiName DeleteBlogArray
 * @apiGroup Blog
 * @apiPermission master
 * @apiParam  access_token master access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Blog not found.
 * @apiError 401 master access only.
 */
router.delete("/blogs/admin/:blogIds(*)", isValidAdmin, blog.destroy);


export default router;
