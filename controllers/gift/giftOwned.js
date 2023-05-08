

const User = require('../../model/user/User');
const Gift = require('../../model/gift/Gift');

async function giveGift(id) {
  const low = [100, 500, 1000, 2000];
  const medium = [3000, 4000, 5000, 6000];
  const lux = [7000, 8000, 9000, 10000];

  const user = await User.findById(id);

  if (low.includes(user.Rankpoints)) {
    const lowGift = await Gift.findOne({ giftType: 'basic' });
    user.Giftowned.push(lowGift._id);
  } 
  if (medium.includes(user.Rankpoints)) {
    const mediumGift = await Gift.findOne({ giftType: 'medium' });
    user.Giftowned.push(mediumGift._id);
  }
  if (lux.includes(user.Rankpoints)) {
    const luxGift = await Gift.findOne({ giftType: 'luxurious' });
    user.Giftowned.push(luxGift._id);
  }
  await user.save();
}

module.exports = giveGift;