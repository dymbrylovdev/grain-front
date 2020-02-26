import { useSelector, shallowEqual } from "react-redux";

function BidSelector(id, by) {
  const bid = useSelector(({ ads: { bestAds, myAds, allBids } }) => {
    if( by === "fromMy"){
      const currentBidFromMy = myAds && myAds.list.filter(item => item.id === Number.parseInt(id));
      if (currentBidFromMy && currentBidFromMy.length > 0) {
        return currentBidFromMy[0];
      }
    }
    if( by === "fromAdmin"){
      const currentBidFromAdmin= allBids && allBids.data.filter(item => item.id === Number.parseInt(id));
      if (currentBidFromAdmin && currentBidFromAdmin.length > 0) {
        return currentBidFromAdmin[0];
      }
    }
    const currentBidFromEqual = bestAds && bestAds.equal.filter(item => item.id === Number.parseInt(id));
    const currentBidFromInequal = bestAds && bestAds.inexact.filter(item => item.id === Number.parseInt(id));
    if (currentBidFromEqual && currentBidFromEqual.length > 0) {
      return currentBidFromEqual[0];
    }
    if (currentBidFromInequal && currentBidFromInequal.length > 0) {
      return currentBidFromInequal[0];
    }
    return { bid: {} };
  }, shallowEqual);
  return { bid };
}

export default BidSelector;
