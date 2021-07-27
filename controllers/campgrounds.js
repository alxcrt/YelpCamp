const CampGround = require("../models/campground");

module.exports.index = async (req, res, next) => {
  const campgrounds = await CampGround.find({});
  res.render("campgrounds/index", { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.showCampground = async (req, res, next) => {
  const { id } = req.params;
  const campground = await await CampGround.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("author");
  if (!campground) {
    req.flash("error", "Campground not found");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campground });
};

module.exports.renderEditForm = async (req, res, next) => {
  const { id } = req.params;
  const campground = await CampGround.findById(id);
  if (!campground) {
    req.flash("error", "Campground not found");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { campground });
};

module.exports.updateCampground = async (req, res, next) => {
  const { id } = req.params;
  const campground = await CampGround.findById(id);

  const updatedCampground = await CampGround.findByIdAndUpdate(
    id,
    {
      ...req.body.campground,
    },
    { useFindAndModify: false }
  );
  req.flash("success", "Campground updated!");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.createCampground = async (req, res, next) => {
  const campground = new CampGround(req.body.campground);
  campground.author = req.user._id;
  await campground.save();
  req.flash("success", "Campground created!");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res, next) => {
  const { id } = req.params;
  await CampGround.findByIdAndDelete(id, { useFindAndModify: false });
  req.flash("success", "Campground deleted!");
  res.redirect(`/campgrounds`);
};