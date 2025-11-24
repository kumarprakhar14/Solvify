import { Link } from "react-router-dom";
import { Code, Smartphone, BarChart, Brain, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: Code,
    title: "Web Development",
    description: "Custom web applications, e-commerce platforms, and progressive web apps built with modern technologies.",
    link: "/services#web-development",
  },
  {
    icon: Smartphone,
    title: "Mobile App Development",
    description: "Native iOS, Android, and cross-platform mobile applications using React Native and Flutter.",
    link: "/services#mobile-development",
  },
  {
    icon: BarChart,
    title: "Data Analysis & Visualization",
    description: "Transform your data into actionable insights with BI dashboards, reporting, and analytics solutions.",
    link: "/services#data-analysis",
  },
  {
    icon: Brain,
    title: "AI Integration",
    description: "Leverage machine learning, computer vision, and NLP to automate and enhance your business processes.",
    link: "/services#ai-integration",
  },
  {
    icon: Zap,
    title: "AI Automation",
    description: "Streamline workflows with intelligent automation, RPA, and business process optimization.",
    link: "/services#ai-automation",
  },
];

const Services = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Our <span className="text-gradient">Services</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Comprehensive IT solutions designed to drive your business forward with cutting-edge technology and
            expert execution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card
                key={index}
                className="group hover:shadow-strong transition-all duration-300 hover:-translate-y-1 gradient-card border-border"
              >
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base mb-4">{service.description}</CardDescription>
                  <Link to={service.link}>
                    <Button variant="link" className="p-0 h-auto">
                      Learn More →
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link to="/services">
            <Button variant="hero" size="lg">
              View All Services
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Services;
