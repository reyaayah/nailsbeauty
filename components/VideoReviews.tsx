import { VideoReview } from "@/types/product";
import { Play } from "lucide-react";
interface VideoReviewsProps {
    reviews: VideoReview[];
}

export default function VideoReviews({ reviews }: VideoReviewsProps) {
    if (!reviews || reviews.length === 0) return null;

    return (
        <section className="mt-24 px-4 pb-20">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-serif mb-10">Seen on You</h2>
                <div className="flex gap-6 overflow-x-auto pb-8 snap-x no-scrollbar">
                    {reviews.map((review) => (
                        <div
                            key={review.id}
                            className="flex-none w-[260px] aspect-[9/16] relative rounded-3xl overflow-hidden shadow-xl snap-start group bg-black"
                        >
                            <video
                                src={review.videoUrl}
                                poster={review.poster}
                                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                                loop
                                muted
                                playsInline
                                onMouseEnter={(e) => e.currentTarget.play()}
                                onMouseLeave={(e) => {
                                    e.currentTarget.pause();
                                    e.currentTarget.currentTime = 0;
                                }}
                            />
                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                                <p className="text-white text-[10px] font-bold tracking-widest uppercase">
                                    {review.user}
                                </p>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                                    <Play size={20} fill="white" className="text-white ml-1" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}