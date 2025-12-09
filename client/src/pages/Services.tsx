import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Code, Smartphone, BarChart, Brain, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const services = [
  {
    id: "web-development",
    icon: Code,
    title: "Web Development",
    description: "Custom web applications, e-commerce platforms, and progressive web apps built with modern technologies.",
    features: [
      "Frontend Development (React, Vue, Angular)",
      "Backend Development (Node.js, Python, PHP)",
      "Full-stack Solutions",
      "E-commerce Platforms",
      "Progressive Web Apps (PWA)",
      "CMS Development",
    ],
    technologies: ["React", "Next.js", "Node.js", "Python", "PostgreSQL", "MongoDB"],
  },
  {
    id: "mobile-development",
    icon: Smartphone,
    title: "Mobile App Development",
    description: "Native and cross-platform mobile applications for iOS and Android.",
    features: [
      "Native iOS Development (Swift)",
      "Native Android Development (Kotlin)",
      "Cross-platform (React Native)",
      "Cross-platform (Flutter)",
      "UI/UX Design for Mobile",
      "App Store Optimization",
    ],
    technologies: ["React Native", "Flutter", "Swift", "Kotlin", "Firebase"],
  },
  {
    id: "data-analysis",
    icon: BarChart,
    title: "Data Analysis & Visualization",
    description: "Transform your data into actionable insights with BI dashboards and analytics solutions.",
    features: [
      "Business Intelligence Dashboards",
      "Data Visualization",
      "Predictive Analytics",
      "Reporting Automation",
      "Data Pipeline Development",
      "Statistical Analysis",
    ],
    technologies: ["Python", "R", "Tableau", "Power BI", "SQL", "Apache Spark"],
  },
  {
    id: "ai-integration",
    icon: Brain,
    title: "AI Integration",
    description: "Leverage machine learning and AI to automate and enhance your business processes.",
    features: [
      "Machine Learning Models",
      "Natural Language Processing",
      "Computer Vision Solutions",
      "Recommendation Systems",
      "Chatbots & Virtual Assistants",
      "AI-powered Analytics",
    ],
    technologies: ["TensorFlow", "PyTorch", "OpenAI", "Hugging Face", "LangChain"],
  },
  {
    id: "ai-automation",
    icon: Zap,
    title: "AI Automation",
    description: "Streamline workflows with intelligent automation and business process optimization.",
    features: [
      "Robotic Process Automation (RPA)",
      "Workflow Automation",
      "Document Processing Automation",
      "Business Process Optimization",
      "Integration with Existing Systems",
      "Custom Automation Solutions",
    ],
    technologies: ["UiPath", "Automation Anywhere", "Zapier", "Make", "Python"],
  },
];

const Services = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="py-20 gradient-hero">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Our <span className="text-gradient">Services</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Comprehensive IT solutions designed to drive your business forward with cutting-edge technology and
                expert execution.
              </p>
            </div>
          </div>
        </section>

        {/* Services List */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="space-y-16">
              {services.map((service, index) => {
                const Icon = service.icon;
                return (
                  <div key={service.id} id={service.id} className="scroll-mt-20">
                    <Card className="gradient-card border-border hover:shadow-strong transition-all duration-300">
                      <CardHeader>
                        <div className="flex items-start gap-6">
                          <div className="w-16 h-16 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
                            <Icon className="h-8 w-8 text-white" />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-3xl mb-3">{service.title}</CardTitle>
                            <CardDescription className="text-lg">{service.description}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 gap-8">
                          <div>
                            <h4 className="font-semibold mb-4 text-lg">Key Features</h4>
                            <ul className="space-y-2">
                              {service.features.map((feature, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                                  <span className="text-muted-foreground">{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-4 text-lg">Technologies We Use</h4>
                            <div className="flex flex-wrap gap-2">
                              {service.technologies.map((tech, i) => (
                                <span
                                  key={i}
                                  className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm font-medium"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                            <div className="mt-6">
                              <Link to="/contact">
                                <Button variant="hero">Request Quote for This Service</Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Need a Custom Solution?
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Don't see exactly what you're looking for? We specialize in creating tailored IT solutions that match
                your unique requirements.
              </p>
              <Link to="/contact">
                <Button variant="hero" size="lg">
                  Discuss Your Project
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Services;
