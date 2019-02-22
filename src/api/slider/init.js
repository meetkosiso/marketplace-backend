import { success, fail } from "./../../services/response/";
import Slider from "./model";
import { getAnyVendor } from "../vendor/init";

export async function initSlider(req, res) {

  let vendor;
  try {
    vendor = await getAnyVendor();
  } catch (err) {
    console.log(err);
  }

  if (!(vendor)) vendor = { _id: "5b83c483f85b7a561ce95107" };

  const slider = {
    name: "home slide",
    vendor: vendor._id,
    kind: "image",
    page: {
      product: true,
      brand: true,
      category: false,
      blog: false,
    },
    place: "top",
    elements: {
      element0: {
        active: true,
        image: "https://storage.googleapis.com/olaife/images/media/5b83d78ff85b7a561ce95110df4defd832093f90b5848e47d3e23903.jpeg",
        position: 0,
        title: "Welcome to front shop",
        subtitle: "Subtitle to shop",
      },
      element1: {
        active: true,
        image: "https://storage.googleapis.com/olaife/images/media/5b83d78ff85b7a561ce95110df4defd832093f90b5848e47d3e23903.jpeg",
        position: 1,
        title: "Welcome to front shop",
        subtitle: "Subtitle to shop",
      },
      element2: {
        active: true,
        image: "https://storage.googleapis.com/olaife/images/media/5b83d78ff85b7a561ce95110df4defd832093f90b5848e47d3e23903.jpeg",
        position: 2,
        title: "Welcome to front shop",
        subtitle: "Subtitle to shop",
      },
      element3: {
        active: true,
        image: "https://storage.googleapis.com/olaife/images/media/5b83d78ff85b7a561ce95110df4defd832093f90b5848e47d3e23903.jpeg",
        position: 3,
        title: "Welcome to front shop",
        subtitle: "Subtitle to shop",
      },
      element4: {
        active: false,
        image: "",
        position: 4,
        title: "",
        subtitle: "",
      },
      element5: {
        active: false,
        image: "",
        position: 5,
        title: "",
        subtitle: "",
      },
      element6: {
        active: false,
        image: "",
        position: 6,
        title: "",
        subtitle: "",
      },
      element7: {
        active: false,
        image: "",
        position: 7,
        title: "",
        subtitle: "",
      },
      element8: {
        active: false,
        image: "",
        position: 8,
        title: "",
        subtitle: "",
      },
      element9: {
        active: false,
        image: "",
        position: 9,
        title: "",
        subtitle: "",
      },
    },
    style: {
      title: "color: blue",
      subtitle: "color: blue",
      image: "",
      background: "transparent",
      color: "black",
    },
  };

  const record = new Slider(slider);
  return record.save()
    .then((result) => {
      if (!result) {
        fail(res, 404, "Error not found newly added Slider");
      }
      console.log(`\r\nSlider is added ${result.id}`);
      return success(res, 200, result, "Done Initializing Slider Data!");
    }).catch((err) => {
      fail(res, 500, `Error adding Slider ${err.message}`);
    });
}

export function getAnySlider() {
  Slider.findOne().sort({ created_at: -1 }).exec((_err, result) => result);
}
