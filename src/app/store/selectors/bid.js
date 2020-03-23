import { useSelector, shallowEqual } from "react-redux";

function BidSelector(id, by) {
  const bid = useSelector(({ ads: { bestBids, myBids, allBids } }) => {
    if(!id){
      return { bid: {} };
    }
    if( by === "fromMy"){
      const currentBidFromMy = myBids && myBids.list && myBids.list.filter(item => item.id === Number.parseInt(id));
      if (currentBidFromMy && currentBidFromMy.length > 0) {
        return currentBidFromMy[0];
      }
    }
    if( by === "fromAdmin"){
      const currentBidFromAdmin= allBids &&  allBids.data&& allBids.data.filter(item => item.id === Number.parseInt(id));
      if (currentBidFromAdmin && currentBidFromAdmin.length > 0) {
        return currentBidFromAdmin[0];
      }
    }
    const currentBidFromEqual = bestBids &&  bestBids.equal && bestBids.equal.filter(item => item.id === Number.parseInt(id));
    const currentBidFromInequal = bestBids && bestBids.inexact && bestBids.inexact.filter(item => item.id === Number.parseInt(id));
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
