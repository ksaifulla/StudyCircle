import { Separator } from "./ui/separator";

export default function Dashboard() {
  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <ProductPage />
    </div>
  );
}

const HeroSection = () => {
  return (
    <section className="bg-[#111316] text-white py-16 w-full">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl font-extrabold mb-4 transition-all duration-300">
          Study, Share, Succeed—Together!
        </h1>
        <p className="text-2xl mb-6 opacity-80">
          Collaborate with your study group in real-time with Study Circle.
        </p>
        <div className="mt-8">
          <button className="bg-[#f39c12] text-black py-3 px-6 rounded-full text-lg transition duration-300 hover:bg-[#e67e22] transform hover:scale-105">
            Start Collaborating Now
          </button>
        </div>
      </div>
    </section>
  );
};


// const AboutSection = () => {
//   return (
//     // <section className="py-20 bg-[#111316] text-white flex-shrink-0">
//     //   <div className="container mx-auto px-4 text-center">
//     //     <h2 className="text-4xl font-extrabold mb-4 text-white">What is StudyCircle?</h2>
//     //     <p className="text-lg text-gray-400">
//     //       StudyCircle is a collaborative study platform designed to bring students together for shared learning experiences. Whether you’re preparing for exams or working on group projects, StudyCircle helps you stay connected and productive with your peers.
//     //     </p>
//     //   </div>
//     // </section>
//   );
// };

const FeaturesSection = () => {
  return (
    <section className="bg-[#111316] py-16 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-extrabold mb-12 text-white">Key Features</h2>
        <div className="flex flex-wrap justify-center gap-8">
          <FeatureCard
            title="Real-time Chat"
            description="Communicate with your study group instantly."
          />
          <FeatureCard
            title="Collaborative Note-taking"
            description="Work together on notes, projects, and ideas."
          />
          <FeatureCard
            title="Schedule Management"
            description="Keep track of your study sessions and deadlines."
          />
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ title, description }) => {
  return (
    <div className="w-full md:w-1/3 px-4 mb-8">
      <div className="p-8 bg-[#282c34] rounded-xl shadow-xl hover:bg-[#2f353f] transition-all duration-300 ease-in-out transform hover:scale-105">
        <h3 className="text-2xl font-semibold mb-4 text-white">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </div>
    </div>
  );
};

const ProductPage = () => {
  return (
    <div className="bg-[#111316] flex flex-col flex-grow w-full">
      <HeroSection />
      <div className="px-16">
        <Separator />
      </div>
      {/* <AboutSection /> */}
      <div className="overflow-y-auto scrollbar-hidden">
        <Separator />
      </div>
      <FeaturesSection />
    </div>
  );
};


