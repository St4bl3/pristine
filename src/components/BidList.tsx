// src/components/BidList.tsx

interface BidListProps {
  bids: { id: string; bidderId: string; bidAmount: number; timestamp: string }[];
}

export default function BidList({ bids }: BidListProps) {
  return (
    <div>
      <h3 className="text-xl font-bold mb-2">Bid History</h3>
      <ul>
        {bids.map((bid) => (
          <li key={bid.id} className="border-b py-2">
            <p>Bidder: {bid.bidderId}</p>
            <p>Amount: ${bid.bidAmount}</p>
            <p>Time: {new Date(bid.timestamp).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
