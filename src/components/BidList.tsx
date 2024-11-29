// components/BidList.tsx

interface Bid {
  id: string;
  bidderId: string;
  bidAmount: number;
  timestamp: string;
}

interface BidListProps {
  bids?: Bid[]; // Make bids optional
}

export default function BidList({ bids = [] }: BidListProps) {
  // Provide a default value
  if (bids.length === 0) {
    return <p className="text-gray-500">No bids yet.</p>;
  }

  return (
    <div className="bg-white p-4 rounded-md shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2 border-gray-200">
        Bid History
      </h3>
      <ul>
        {bids.map((bid) => (
          <li
            key={bid.id}
            className="flex justify-between items-center py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
          >
            <div className="flex-1">
              <p className="text-sm text-gray-700">
                <span className="font-medium text-accent1">Bidder ID:</span>{" "}
                {bid.bidderId}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-medium text-accent1">Amount:</span> $
                {bid.bidAmount}
              </p>
            </div>
            <div className="text-xs text-gray-500 whitespace-nowrap">
              {new Date(bid.timestamp).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
