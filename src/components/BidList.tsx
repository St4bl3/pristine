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
    return <p className="text-gray-600">No bids yet.</p>;
  }

  return (
    <div>
      <h3 className="text-xl font-bold mb-2">Bid History</h3>
      <ul>
        {bids.map((bid) => (
          <li key={bid.id} className="border-b py-2">
            <p>
              <span className="font-semibold">Bidder Clerk ID:</span>{" "}
              {bid.bidderId}
            </p>
            <p>
              <span className="font-semibold">Amount:</span> ${bid.bidAmount}
            </p>
            <p>
              <span className="font-semibold">Time:</span>{" "}
              {new Date(bid.timestamp).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
