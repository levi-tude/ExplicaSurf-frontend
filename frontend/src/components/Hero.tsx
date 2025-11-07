import heroImage from "@/assets/stella-maris-hero.jpg";

const Hero = () => {
  return (
    <section className="relative h-[300px] md:h-[400px] overflow-hidden">
      <img
        src={heroImage}
        alt="Praia de Stella Maris, Salvador-BA"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80" />
      <div className="absolute bottom-6 left-0 right-0 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
          Stella Maris, Salvador-BA
        </h2>
      </div>
    </section>
  );
};

export default Hero;
