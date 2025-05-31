/* eslint-disable no-unused-vars */
import heroImage from "../../assets/heroImage1.png";
import logo from "../../assets/logo.png";
import Navbar from "../../Components/Navbar";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-primary flex items-center">
      <Navbar />

      {/* Wave SVG as background */}
      <div className="absolute left-0 bottom-0 w-full pointer-events-none select-none z-0">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1920 480"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className="w-full h-32 sm:h-48 md:h-72 lg:h-[600px]"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient
              id="wave-half-gradient"
              x1="0"
              y1="0"
              x2="1920"
              y2="0"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor="var(--tw-prose-accent, #F59E42)" />
              <stop offset="1" stopColor="var(--tw-prose-accent, #F59E42)" />
            </linearGradient>
          </defs>

          {/* Animated path */}
          <motion.path
            initial={{ d: "M0 240 Q480 480 960 240 T1920 240 V480 H0 Z" }}
            animate={{
              d: [
                "M0 240 Q480 480 960 240 T1920 240 V480 H0 Z",
                "M0 220 Q480 440 960 220 T1920 220 V480 H0 Z",
                "M0 240 Q480 480 960 240 T1920 240 V480 H0 Z"
              ]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            fill="url(#wave-half-gradient)"
            stroke="var(--tw-prose-accent, #F59E42)"
            strokeWidth="8"
          />
        </svg>
      </div>

      {/* Content */}
      <div
        className="relative z-10 flex flex-row items-center justify-between text-secondary text-left px-2 sm:px-4 md:px-6 pt-0 max-w-6xl w-full mx-auto gap-4 sm:gap-6 md:gap-8"
        style={{ marginTop: "-2rem" }}
      >
        <motion.div
          className="flex-1 rounded-3xl p-4 sm:p-6 md:p-10 flex flex-col items-start space-y-4 sm:space-y-6"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold drop-shadow-xl leading-tight text-secondary">
            Mahi Bakery
          </h1>
          <h3 className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl font-semibold drop-shadow-xl leading-tight text-secondary">
            An Ideal home of quality food.
          </h3>
          <button className="mt-2 md:mt-4 px-4 sm:px-6 md:px-8 py-2 sm:py-3 bg-accent text-primary font-bold rounded-full shadow-lg hover:scale-105 hover:bg-accent/80 transition-all duration-200 border-2 border-primary cursor-pointer text-xs xs:text-sm sm:text-base md:text-lg">
            See More
          </button>
        </motion.div>

        <motion.div
          className="flex-1 flex justify-center items-center mb-0 md:pl-0 lg:pl-8"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <img
            src={heroImage}
            alt="Bakery"
            className="w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-[36rem] lg:h-[36rem] object-cover rounded-2xl"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
