import { Shield, Users, Clock, Award, HeadphonesIcon, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Shield,
    title: "Trusted & Reliable",
    description: "Vetted service providers with proven track records and industry certifications.",
  },
  {
    icon: Users,
    title: "Expert Team",
    description: "Access to top-tier developers, designers, and IT specialists worldwide.",
  },
  {
    icon: Clock,
    title: "On-Time Delivery",
    description: "98% of projects delivered on schedule with consistent quality standards.",
  },
  {
    icon: Award,
    title: "Quality Assurance",
    description: "Rigorous testing and QA processes ensure exceptional results every time.",
  },
  {
    icon: HeadphonesIcon,
    title: "24/7 Support",
    description: "Round-the-clock customer support to address any concerns or questions.",
  },
  {
    icon: TrendingUp,
    title: "Scalable Solutions",
    description: "Flexible services that grow with your business needs and requirements.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Why Choose <span className="text-gradient">Solvify</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            We provide more than just IT services – we deliver complete digital transformation solutions backed by
            expertise and commitment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="gradient-card border-border hover:shadow-strong transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
