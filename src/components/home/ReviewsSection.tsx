import { Star, ShieldCheck } from "lucide-react";
import { Section } from "@/components/shared/Section";
import { Badge } from "@/components/shared/Badge";

// Zero fake reviews - real customer reviews only
const reviews: Array<{
  id: number;
  name: string;
  location: string;
  candle: string;
  rating: number;
  title: string;
  content: string;
  date: string;
}> = [];

export function ReviewsSection() {
  return (
    <Section
      background="dark-alt"
      headerAlign="center"
      badge={
        <Badge variant="verified">
          <ShieldCheck className="w-3.5 h-3.5 text-[#81C784]" />
          Customer Experiences
        </Badge>
      }
      title="Loved across homes"
      subtitle="Honest reviews from customers lighting our handcrafted candles."
    >
      {reviews.length === 0 ? (
        <div className="max-w-md mx-auto text-center py-12 px-6 rounded-[24px] bg-[#FAF3EA] border border-[#E6D8C6] shadow-sm">
          <div className="flex justify-center gap-1 mb-3 text-[#D9A441]">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-[#D9A441]/40 text-[#D9A441]" />
            ))}
          </div>
          <h4 className="font-display text-xl text-[#2A1B15] font-medium mb-2">
            No reviews yet
          </h4>
          <p className="text-sm text-[#5C463B] font-light leading-relaxed">
            Be the first to experience our candle collection and share your review.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <article
              key={rev.id}
              className="bg-[#FAF3EA] p-5 md:p-6 rounded-[24px] flex flex-col justify-between space-y-4 shadow-[0_4px_24px_rgba(0,0,0,0.15)] border border-[#E6D8C6] hover:shadow-xl transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex text-[#D9A441]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#D9A441]" />
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#1B5E20]/15 text-[#1B5E20] border border-[#1B5E20]/30">
                    Verified
                  </span>
                </div>
                <h4 className="font-display text-lg text-[#2A1B15] mb-2 font-medium leading-snug">
                  &ldquo;{rev.title}&rdquo;
                </h4>
                <p className="text-sm text-[#5C463B] leading-relaxed italic">
                  {rev.content}
                </p>
              </div>
              <div className="pt-4 border-t border-[#E6D8C6] space-y-1">
                <p className="text-sm font-semibold text-[#2A1B15]">{rev.name}</p>
                <p className="text-xs text-[#5C463B]">{rev.location}</p>
                <div className="flex items-center justify-between pt-1 text-xs text-[#5C463B]">
                  <span className="font-medium text-[#2A1B15]">{rev.candle}</span>
                  <span>{rev.date}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </Section>
  );
}
