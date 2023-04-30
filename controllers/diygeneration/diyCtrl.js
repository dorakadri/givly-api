const expressAsyncHandler = require("express-async-handler");
const scrapeDiyCrafts = require("./diygeneration");



const Diyfetching = expressAsyncHandler(async (req, res) => {
    const { objectname } = req.params;

    scrapeDiyCrafts(objectname)
      .then(result => {
        const crafts = JSON.parse(result);
        res.json(crafts);
      })
      .catch(err =>   res.json(err));
  });

  module.exports = {

    Diyfetching,
 
  };