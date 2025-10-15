'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import StarRating from '@/components/ui/star-rating';
import { Loader2 } from 'lucide-react';

interface ReviewFormProps {
  jobId: string;
  revieweeId: string;
  revieweeRole: 'freelancer' | 'client';
  onSubmit: () => void;
  onCancel: () => void;
}

export default function ReviewForm({ jobId, revieweeId, revieweeRole, onSubmit, onCancel }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || comment.trim() === '') {
      setError('Please provide a rating and comment.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId, revieweeId, rating, comment, revieweeRole }),
      });

      if (response.ok) {
        onSubmit();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to submit review.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg bg-white dark:bg-gray-800">
      <h3 className="text-lg font-semibold">
        Review {revieweeRole === 'freelancer' ? 'Freelancer' : 'Client'}
      </h3>

      <div>
        <label className="block text-sm font-medium mb-2">Rating</label>
        <StarRating rating={rating} onRatingChange={setRating} />
      </div>

      <div>
        <label htmlFor="comment" className="block text-sm font-medium mb-2">
          Feedback
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
          rows={4}
          placeholder="Share your experience..."
          maxLength={1000}
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex space-x-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Submit Review
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
