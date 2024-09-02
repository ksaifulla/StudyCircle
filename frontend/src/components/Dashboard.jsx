import { Separator } from "./ui/separator";

export default function Dashboard() {
  return <>
    <ProductPage/>
  </>
}

const HeroSection = () => {
  return (
    <section className="bg-[#111316] text-white py-20 w-full">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl font-bold mb-4">Study, Share, Succeed—Together!</h1>
        <p className="text-xl mb-6">
          Collaborate with your study group in real-time with StudyCircle.
        </p>
      </div>
    </section>
  );
};

const AboutSection = () => {
  return (
    <section className="py-8 bg-[#111316] text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">What is StudyCircle?</h2>
        <p className="text-lg text-gray-400">
          StudyCircle is a collaborative study platform designed to bring
          students together for shared learning experiences. Whether you’re
          preparing for exams or working on group projects, StudyCircle helps
          you stay connected and productive with your peers.
        </p>
      </div>
    </section>
  );
};

const FeaturesSection = () => {
  return (
    <section className="bg-soft-900 py-8 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-12">Key Features</h2>
        <div className="flex flex-wrap -mx-4">
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
      <div className="p-8 bg-[#282c34] rounded-lg shadow-lg hover:bg-[#33373f] transition duration-300 ease-in-out">
        <h3 className="text-xl font-semibold mb-4 text-white">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </div>
    </div>
  );
};


const ProductPage = () => {
  return (
    <div className="bg-[#111316] w-full">
      <HeroSection />
      <div className="px-16">
      <Separator/>
      </div>
      <AboutSection />
<div className="px-16">
      <Separator/>
      </div>
      <FeaturesSection />
    </div>
  );
};

