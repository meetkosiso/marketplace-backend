/*
* @author kosiso
* @coauthor Sylvia
*/

import express from "express";
import * as slider from "./controller";
import { isValidAdmin, isValidVendor } from "../auth/controller";
import { initSlider } from "./init";

const router = express.Router();


router.get("/init/slider", initSlider);

/**
 * @api {post} /sliders Create slider
 * @apiName CreateSlider
 * @apiGroup Slider
 * @apiParam {String} access_token master access token.
 * @apiParam {String} name name of slider
 * @apiParam {Schema.Types.ObjectId} vendor vendorID
 * @apiParam {String} kind slider type(image/text)
 * @apiParam {Array} page [{product, brand, category, blog}] page slider will appear
 * @apiParam {String} place slider location
 * @apiParam {Array} elements [{element[{active, image, position, title, subtitle}]}]
 * slider elements/properties
 * @apiParam {Array} style [{title, substitle, image, background, color}] slider style
 * @apiParam {String} standing slider status(show/hide/trashed)
 * @apiParam {Date} updated date of last update
 * @apiSuccess {Object} Slider Slider's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Slider not found.
 * @apiError 401 master access only.
 */
router.post("/sliders", isValidVendor, slider.create);

/**
 * @api {get} /sliders Retrieve sliders
 * @apiName RetrieveSliders
 * @apiGroup Slider
 * @apiParam {String} vendorDomain vendor's domain name
 * @apiSuccess {Object[]} rows List of Sliders.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get("/sliders/vendor/:vendorDomain", slider.findVendorSliders);
/**
 * @api {get} /sliders/:id Retrieve slider
 * @apiName RetrieveSlider
 * @apiGroup Slider
 * @apiSuccess {Object} slider Slider's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Slider not found.
 */
router.get("/sliders/:sliderId", slider.findOne);

/**
 * @api {put} /sliders/:id Update slider
 * @apiName UpdateSlider
 * @apiGroup Slider
 * @apiPermission master
 * @apiParam {String} access_token master access token.
 * @apiParam {String} name name of slider
 * @apiParam {Schema.Types.ObjectId} vendor vendorID
 * @apiParam {String} kind slider type(image/text)
 * @apiParam {Array} page [{product, brand, category, blog}] page slider will appear
 * @apiParam {String} place slider location
 * @apiParam {Array} elements [{element[{active, image, position, title, subtitle}]}]
 * slider elements/properties
 * @apiParam {Array} style [{title, substitle, image, background, color}] slider style
 * @apiParam {String} standing slider status(show/hide/trashed)
 * @apiParam {Date} updated date of last update
 * @apiSuccess {Object} slider Slider's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Slider not found.
 * @apiError 401 master access only.
 */
router.put("/sliders/:sliderId", isValidVendor, slider.update);

/**
 * @api {delete} /sliders/:id Delete slider
 * @apiName DeleteSlider
 * @apiGroup Slider
 * @apiPermission master
 * @apiParam {String} access_token master access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Slider not found.
 * @apiError 401 master access only.
 */
router.delete("/sliders/:sliderId", isValidVendor, slider.destroy);

/**
* @api {delete} /sliders/admin/:sliderIds(*) Delete arrays of slider
* @apiName DeleteSliderArray
* @apiGroup Slider
* @apiParam {String} sliderIds arrays of slider Ids
* @apiSuccess (Success 204) 204 No Content.
* @apiError 404 Slider not found.
* @apiError 401 master access only.
*/
router.delete("/sliders/admin/:sliderIds(*)", isValidAdmin, slider.destroy);

export default router;
