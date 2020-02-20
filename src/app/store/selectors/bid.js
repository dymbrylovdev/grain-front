import { useSelector, shallowEqual } from "react-redux";

function BidSelector(id) {
  const bid = useSelector(({ ads: { bestAds } }) => {
    const currentBid = bestAds.filter(item => item.id === Number.parseInt(id));
    if (currentBid.length > 0) {
      return currentBid[0];
    }
    return { bid: {} };
  }, shallowEqual);
  return { bid };
}

export default BidSelector;
