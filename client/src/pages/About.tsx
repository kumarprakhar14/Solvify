import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Target, Eye, Award, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const values = [
  {
    icon: Target,
    title: "Client-Centric Approach",
    description: "We prioritize understanding your unique challenges and delivering solutions that exceed expectations.",
  },
  {
    icon: Eye,
    title: "Innovation First",
    description: "Staying ahead of technology trends to provide cutting-edge solutions for tomorrow's challenges.",
  },
  {
    icon: Award,
    title: "Quality Excellence",
    description: "Rigorous quality standards ensuring every project meets the highest levels of performance and reliability.",
  },
  {
    icon: Users,
    title: "Collaborative Partnership",
    description: "Building long-term relationships through transparent communication and shared success.",
  },
];

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="py-20 gradient-hero">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                About <span className="text-gradient">Solvify</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Empowering businesses through innovative IT solutions and expert service delivery since 2014.
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <Card className="gradient-card border-border">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center mb-4">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    To bridge the gap between businesses and technology by providing accessible, high-quality IT
                    solutions that drive growth, efficiency, and innovation. We believe every startup and SME deserves
                    access to world-class technical expertise.
                  </p>
                </CardContent>
              </Card>

              <Card className="gradient-card border-border">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center mb-4">
                    <Eye className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    To become the world's most trusted platform for connecting businesses with IT service providers,
                    enabling digital transformation across all industries. We envision a future where technology
                    barriers no longer limit business potential.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
                Our <span className="text-gradient">Story</span>
              </h2>
              <div className="space-y-6 text-muted-foreground leading-relaxed">
                <p>
                  Founded in 2014, Solvify began with a simple observation: small and medium-sized businesses were
                  struggling to find reliable, affordable IT solutions. The market was dominated by expensive agencies
                  out of reach for most startups, or unreliable freelancers who couldn't deliver enterprise-grade
                  quality.
                </p>
                <p>
                  We set out to change that by creating a platform that carefully vets and connects businesses with
                  expert IT service providers. Our rigorous selection process ensures that every provider on our
                  platform has proven expertise, a track record of successful projects, and a commitment to client
                  satisfaction.
                </p>
                <p>
                  Today, we've facilitated over 500 successful projects, helping businesses across 30+ countries
                  transform their digital presence. From early-stage startups to established SMEs, our clients trust us
                  to deliver solutions that are not just technically sound, but also aligned with their business goals
                  and budget constraints.
                </p>
                <p>
                  Our team brings together decades of experience in software development, project management, and
                  business consulting. We understand both the technical and business sides of IT projects, allowing us
                  to serve as true partners in your digital transformation journey.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Our <span className="text-gradient">Values</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                The principles that guide every decision we make and every solution we deliver
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <Card key={index} className="gradient-card border-border hover:shadow-strong transition-all duration-300">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg mb-2">{value.title}</h3>
                          <p className="text-muted-foreground">{value.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Methodology */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
                Our <span className="text-gradient">Methodology</span>
              </h2>
              <div className="space-y-6">
                <Card className="gradient-card border-border">
                  <CardContent className="pt-6">
                    <h3 className="font-bold text-xl mb-3">Discovery & Analysis</h3>
                    <p className="text-muted-foreground">
                      We begin every project with a thorough understanding of your business objectives, technical
                      requirements, and constraints. This ensures our solutions are perfectly aligned with your goals.
                    </p>
                  </CardContent>
                </Card>

                <Card className="gradient-card border-border">
                  <CardContent className="pt-6">
                    <h3 className="font-bold text-xl mb-3">Strategic Planning</h3>
                    <p className="text-muted-foreground">
                      Our team develops a comprehensive project plan with clear milestones, deliverables, and success
                      metrics. We believe in transparent communication and setting realistic expectations.
                    </p>
                  </CardContent>
                </Card>

                <Card className="gradient-card border-border">
                  <CardContent className="pt-6">
                    <h3 className="font-bold text-xl mb-3">Agile Development</h3>
                    <p className="text-muted-foreground">
                      Using agile methodologies, we deliver working solutions incrementally, allowing for feedback and
                      adjustments throughout the development process. This ensures the final product exceeds
                      expectations.
                    </p>
                  </CardContent>
                </Card>

                <Card className="gradient-card border-border">
                  <CardContent className="pt-6">
                    <h3 className="font-bold text-xl mb-3">Quality Assurance & Support</h3>
                    <p className="text-muted-foreground">
                      Rigorous testing ensures every solution meets our high standards. Post-launch, we provide ongoing
                      support and maintenance to ensure continued success and optimal performance.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">500+</div>
                <div className="text-sm text-muted-foreground">Projects Completed</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">300+</div>
                <div className="text-sm text-muted-foreground">Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">98%</div>
                <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">10+</div>
                <div className="text-sm text-muted-foreground">Years Experience</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
