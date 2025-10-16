import StarRating from '@/components/ui/star-rating';

interface Review {
  _id: string;
  rating: number;
  comment: string;
  revieweeRole: 'freelancer' | 'client';
  reviewerId: {
    firstName: string;
    lastName: string;
    userImage: string;
  };
  createdAt: string;
}

interface ReviewDisplayProps {
  reviews: Review[];
  title?: string;
}

export default function ReviewDisplay({ reviews, title = 'Reviews' }: ReviewDisplayProps) {
  if (reviews.length === 0) {
    return <p className="text-gray-500">No reviews yet.</p>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      {reviews.map((review) => (
        <div key={review._id} className="p-4 border rounded-lg bg-white dark:bg-gray-800">
          <div className="flex items-center space-x-3 mb-2">
            <img
              src={review.reviewerId.userImage}
              alt={`${review.reviewerId.firstName} ${review.reviewerId.lastName}`}
              className="w-8 h-8 rounded-full"
            />
            <div>
              <p className="font-medium">
                {review.reviewerId.firstName} {review.reviewerId.lastName}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <StarRating rating={review.rating} readonly />
          <p className="mt-2 text-gray-700 dark:text-gray-300">{review.comment}</p>
        </div>
      ))}
    </div>
  );
}
