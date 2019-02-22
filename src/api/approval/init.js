import { success, fail } from "./../../services/response/";
import Blog from "./model";
import { getAnyReview } from "../review/init";
import { getAnyVendor } from "../vendor/init";

export async function init(req, res) {
  let review;
  try {
    review = await getAnyReview();
  } catch (err) {
    console.log(err);
  }

  if (!(review)) review = { _id: "5b54e618ae6b2a035fe83843" };

  let vendor;
  try {
    vendor = await getAnyVendor();
  } catch (err) {
    console.log(err);
  }

  if (!(vendor)) vendor = { _id: "5b83c483f85b7a561ce95107" };

  const blog = {
    vendor: vendor._id,
    review: [review],
    kind: "news",
    title: "New Coin Blog Lorem ipsum",
    summary: "Summary o Lorem ipsum lorem ipsum",
    content: "Content of Lorem ipsum lorem ipsum",
    tag: "coin, new, cryptic",
    meta: {
      views: 230,
      votes: 90,
    },
    image: "https://storage.googleapis.com/olaife/images/media/5b83d591f85b7a561ce9510ce9dac16259764705e5f0e87c3bd016e6.jpeg"
  };

  const b2 = new Blog(blog);

  return b2.save()
    .then((result) => {
      if (!result) {
        fail(res, 404, "Error not found newly added Blog");
      }
      console.log(`\r\nBlog is added ${result.id}`);
      return success(res, 200, result, "Done Initializing Blog Data!");
    }).catch((err) => {
      fail(res, 500, `Error adding Blog ${err.message}`);
    });
}

export function getAnyBlog() {
  Blog.findOne().sort({ created_at: -1 }).exec((_err, result) => result);
}
