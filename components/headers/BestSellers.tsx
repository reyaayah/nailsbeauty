import Image from "next/image";
import React from "react";
interface VacaySectionProps {
    collectionName: string;
}
const VacaySection = ({ collectionName }: VacaySectionProps) => {
    return (
        <section className="w-full font-sans overflow-hidden bg-gradient-to-br from-[#FFF0ED] via-[#FFE4E1] to-[#FFD6E8] pt-20">

            {/* TOP SECTION */}
            <div className="relative max-w-7xl mx-auto min-h-[520px] flex flex-col md:flex-row items-center px-4 md:px-8">

                {/* LEFT IMAGE */}
                <div className="relative w-full md:w-1/2 flex justify-center items-center py-12">
                    <div className="relative w-full max-w-md aspect-square group">

                        {/* Glow */}
                        <div className="absolute inset-0 bg-pink-300/30 blur-3xl rounded-full scale-110 group-hover:scale-125 transition-all duration-700" />

                        {/* Main Image */}
                        <div className="relative z-10 w-full h-full overflow-hidden rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.25)] border-[10px] border-white transform transition duration-500 group-hover:rotate-0 group-hover:scale-105 rotate-[-2deg]">
                            <Image
                                src="/heroes/vacay.png"
                                alt="Vacation Nails"
                                className="w-full h-full object-cover"
                                width={500}
                                height={500}
                            />


                        </div>

                        {/* Floating Sticker */}
                        <div className="absolute -top-6 -left-8 z-20 w-28 md:w-40 animate-float">
                            <Image
                                src="/heroes/greenary.png"
                                alt="vacay sticker"
                                className="drop-shadow-xl rotate-[-12deg]"
                                width={150}
                                height={150}
                            />
                        </div>

                        {/* Bottom Sticker */}
                        <div className="absolute -bottom-8 -right-8 z-20 w-32 md:w-44 hover:scale-110 transition-transform duration-300">
                            <Image
                                src="/heroes/seashells.png"
                                alt="Seashells"
                                className="drop-shadow-lg rotate-[15deg]"
                                width={150}
                                height={150}
                            />
                        </div>
                    </div>
                </div>

                {/* RIGHT CONTENT */}
                <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:items-start pb-16 md:pb-0 md:pl-12 text-center md:text-left">

                    {/* Badge */}
                    <div className="inline-block px-4 py-1 rounded-full bg-white/60 backdrop-blur-md text-pink-600 text-sm font-bold tracking-widest uppercase mb-4 shadow">
                        Effortless Beauty • Travel Essential
                    </div>

                    {/* Subtitle */}
                    <h3 className="text-pink-500 text-2xl md:text-3xl font-serif italic mb-2">
                        Escape in Style
                    </h3>

                    {/* Main Heading */}
                    <h1 className="text-pink-600 text-6xl md:text-8xl font-black tracking-tight leading-[0.85] mb-6">
                        {collectionName}<br />

                    </h1>


                </div>
            </div>




        </section>
    );
};

export default VacaySection;