import { Star } from "lucide-react";

const StarRating = ({ rating, count }: { rating: number; count?: number }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= Math.floor(rating)
              ? "fill-gold text-gold"
              : star <= rating
              ? "fill-gold/50 text-gold"
              : "text-border"
          }`}
        />
      ))}
      <span className="ml-1 text-sm font-semibold text-foreground">{rating}</span>
      {count && <span className="text-sm text-muted-foreground">({count})</span>}
    </div>
  );
};

export default StarRating;
