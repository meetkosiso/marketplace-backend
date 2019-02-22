import { success, fail } from "./../../services/response/";
import Media from "./model";
import { getAnyVendor } from "../vendor/init";

export async function initMedia(req, res) {

  let vendor;
  try {
    vendor = await getAnyVendor();
  } catch (err) {
    console.log(err);
  }

  if (!(vendor)) vendor = { _id: "5b83c483f85b7a561ce95107" };

  const media = {
    mediaType: "mp4",
    vendor: vendor._id,
    purpose: "background",
    page: {
      product: true,
      stock: false,
      vendor: true,
      brand: false,
      category: true,
      blog: false,
    },
    place: "top",
    num: "3",
    url: "https://storage.googleapis.com/olaife/images/media/5b83d591f85b7a561ce9510ce9dac16259764705e5f0e87c3bd016e6.jpeg",
    title: "glare background",
    description: "descending fading glare background",
    style: "color: green",
  };

  const record = new Media(media);
  return record.save()
    .then((result) => {
      if (!result) {
        fail(res, 404, "Error not found newly added Media");
      }
      console.log(`\r\nMedia is added ${result.id}`);
      return success(res, 200, result, "Done Initializing Media Data!");
    }).catch((err) => {
      fail(res, 500, `Error adding Media ${err.message}`);
    });
}

export function getAnyMedia() {
  Media.findOne().sort({ created_at: -1 }).exec((_err, result) => result);
}
