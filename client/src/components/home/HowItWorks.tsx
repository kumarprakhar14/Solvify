import { Search, Send, FileText, Rocket } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Browse Services",
    description: "Explore our comprehensive range of IT solutions and find the perfect match for your business needs.",
    step: "01",
  },
  {
    icon: Send,
    title: "Submit Request",
    description: "Fill out a simple inquiry form detailing your project requirements and business objectives.",
    step: "02",
  },
  {
    icon: FileText,
    title: "Receive Quote",
    description: "Get a detailed, customized quotation with pricing, timeline, and project scope within 24-48 hours.",
    step: "03",
  },
  {
    icon: Rocket,
    title: "Project Start",
    description: "Approve the quote and we'll kick off your project with a dedicated team of expert professionals.",
    step: "04",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            How It <span className="text-gradient">Works</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Four simple steps to transform your business with expert IT solutions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary to-secondary" />
                )}

                <div className="text-center">
                  <div className="relative inline-block mb-4">
                    <div className="w-24 h-24 rounded-2xl gradient-primary flex items-center justify-center mx-auto shadow-strong">
                      <Icon className="h-10 w-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-sm shadow-soft">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
