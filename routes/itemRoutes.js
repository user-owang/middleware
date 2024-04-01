const express = require("express");
const ExpressErr = require("../ExpressError");
const router = new express.Router();
const items = require("../fakeDB");

router.get("", (req, res, next) => {
  try {
    return res.json(items);
  } catch (err) {
    return next(err);
  }
});

router.post("", (req, res, next) => {
  try {
    if (req.body.name && req.body.price) {
      let item = {};
      item["name"] = req.body.name;
      item["price"] = req.body.price;
      items.push(item);
      res.json({ item });
    } else {
      throw new ExpressErr("Name and price required", 400);
    }
  } catch (err) {
    next(err);
  }
});

router.patch("/:name", (req, res, next) => {
  const name = req.params.name;
  try {
    const out = items.find((x) => x["name"] === name);
    if (out === undefined) {
      throw new ExpressErr(`${name} not found`, 404);
    }
    if (!req.body.name && !req.body.price) {
      throw new ExpressErr("Name and/or price is required", 400);
    }
    if (req.body.name) {
      out["name"] = req.body.name;
    }
    if (req.body.price) {
      out["price"] = req.body.price;
    }
    return res.json({ updated: out });
  } catch (err) {
    next(err);
  }
});

router.get("/:name", (req, res, next) => {
  const name = req.params.name;
  try {
    const out = items.find((x) => x["name"] === name);
    if (out === undefined) {
      throw new ExpressErr(`${name} not found`, 404);
    }
    return res.json(out);
  } catch (err) {
    next(err);
  }
});

router.delete("/:name", (req, res, next) => {
  const name = req.params.name;
  try {
    let i = items.findIndex((x) => x["name"] === name);
    if (i === -1) {
      console.log(items);
      throw new ExpressErr(`${name} not found`, 404);
    }
    items.splice(i, 1);
    return res.json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
