import { useSelector, shallowEqual } from "react-redux";

function BidSelector(id) {
  const bid = useSelector(({ ads: { bestAds, myAds } }) => {
    const currentBidFromEqual = bestAds && bestAds.equal.filter(item => item.id === Number.parseInt(id));
    const currentBidFromInequal = bestAds && bestAds.inexact.filter(item => item.id === Number.parseInt(id));
    const currentBidFromMy = myAds && myAds.list.filter(item => item.id === Number.parseInt(id));
    if (currentBidFromEqual && currentBidFromEqual.length > 0) {
      return currentBidFromEqual[0];
    }
    if (currentBidFromInequal && currentBidFromInequal.length > 0) {
      return currentBidFromInequal[0];
    }
    if (currentBidFromMy && currentBidFromMy.length > 0) {
      return currentBidFromMy[0];
    }
    return { bid: {} };
  }, shallowEqual);
  return { bid };
}

export default BidSelector;
