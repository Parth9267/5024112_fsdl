import React from 'react';
import { motion } from 'framer-motion';

const cars = [
  {
    id: 1,
    name: 'Rolls Royce Phantom',
    image: 'https://source.unsplash.com/featured/?rolls-royce',
  },
  {
    id: 2,
    name: 'Lamborghini Huracán',
    image: 'https://source.unsplash.com/featured/?lamborghini',
  },
  {
    id: 3,
    name: 'Mercedes G-Wagon',
    image: 'https://source.unsplash.com/featured/?g-wagon',
  },
  {
    id: 4,
    name: 'Ferrari Roma',
    image: 'https://source.unsplash.com/featured/?ferrari',
  },
];

const PremiumLanding = () => {
  return (
    <div className="premium-landing text-white font-sans">
      {/* hero */}
      <div className="relative h-screen bg-black">
        <img
          src="https://source.unsplash.com/1600x900/?luxury-car,action"
          alt="hero"
          className="absolute inset-0 w-full h-full object-cover object-center mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black/90" />

        {/* quick booking bar */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-11/12 max-w-4xl bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4 flex flex-wrap gap-4 items-center shadow-[0_0_20px_rgba(212,175,55,0.3)]">
          <input
            type="text"
            placeholder="Pickup Location"
            className="flex-1 min-w-[150px] bg-transparent placeholder-white/70 text-white outline-none px-3 py-2 rounded"
          />
          <input
            type="date"
            className="bg-transparent placeholder-white/70 text-white outline-none px-3 py-2 rounded"
          />
          <select className="bg-transparent text-white outline-none px-3 py-2 rounded">
            <option>Any Brand</option>
            <option>Rolls Royce</option>
            <option>Lamborghini</option>
            <option>Mercedes</option>
          </select>
          <button className="bg-gradient-to-r from-[#D4AF37] via-[#F9E498] to-[#B8860B] px-6 py-2 rounded shadow-[0_0_20px_rgba(212,175,55,0.3)]">
            Book Now
          </button>
        </div>
      </div>

      {/* premium fleet grid */}
      <section className="py-16 px-6 bg-[#0A0A0A]">
        <motion.h2
          className="text-4xl font-serif text-center text-[#D4AF37] mb-8"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Our Premium Fleet
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {cars.map((car) => (
            <motion.div
              key={car.id}
              className="relative group h-64 rounded-lg overflow-hidden bg-black/40 backdrop-blur-sm border border-white/20"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <img
                src={car.image}
                alt={car.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="relative z-10 p-4 flex flex-col justify-end h-full">
                <h3 className="font-serif text-2xl text-[#D4AF37]">
                  {car.name}
                </h3>
                <button className="mt-4 self-start px-4 py-2 border border-[#D4AF37] rounded hover:bg-[#D4AF37]/20 transition">
                  Book Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* trust bar */}
      <div className="bg-[#0A0A0A] py-2">
        <div className="max-w-6xl mx-auto flex justify-center items-center gap-8">
          <span className="text-sm text-white/70">As seen in:</span>
          {/* placeholder logos */}
          <img src="https://via.placeholder.com/80x30?text=Audi" alt="Audi" />
          <img src="https://via.placeholder.com/80x30?text=BMW" alt="BMW" />
          <img src="https://via.placeholder.com/80x30?text=Ferrari" alt="Ferrari" />
        </div>
      </div>

      {/* testimonials */}
      <section className="py-16 px-6 bg-black">
        <motion.h2
          className="text-4xl font-serif text-center text-white mb-8"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          What Our Clients Say
        </motion.h2>
        <div className="max-w-4xl mx-auto space-y-12">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xl italic">
              "Renting from CARx felt like walking into a VIP lounge. The
              service was impeccable."
            </p>
            <p className="mt-4 text-[#D4AF37]">★★★★★</p>
            <p className="mt-2 font-semibold">— James L.</p>
          </motion.div>
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xl italic">
              "The cars are art. Booking was seamless, and the staff treated me
              like royalty."
            </p>
            <p className="mt-4 text-[#D4AF37]">★★★★★</p>
            <p className="mt-2 font-semibold">— Maria S.</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default PremiumLanding;
