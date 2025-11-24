import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

const projects = [
  {
    title: "E-Commerce Platform Redesign",
    client: "RetailCo",
    category: "Web Development",
    tags: ["React", "Node.js", "PostgreSQL"],
    description:
      "Complete redesign and development of a high-traffic e-commerce platform, improving conversion rates by 45% and reducing page load times by 60%.",
    image: "https://images.unsplash.com/photo-1661956602116-aa6865609028?w=800&h=500&fit=crop",
  },
  {
    title: "Healthcare Mobile App",
    client: "MediCare Solutions",
    category: "Mobile Development",
    tags: ["React Native", "Firebase", "HealthKit"],
    description:
      "Cross-platform mobile app for patient management, appointment scheduling, and telemedicine consultations serving 50,000+ active users.",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=500&fit=crop",
  },
  {
    title: "Business Intelligence Dashboard",
    client: "DataTech Industries",
    category: "Data Analysis",
    tags: ["Python", "Tableau", "SQL"],
    description:
      "Real-time BI dashboard integrating multiple data sources, providing executives with actionable insights and automated reporting.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop",
  },
  {
    title: "AI-Powered Customer Service",
    client: "ServiceHub",
    category: "AI Integration",
    tags: ["OpenAI", "LangChain", "Python"],
    description:
      "Intelligent chatbot reducing customer service response time by 80% and handling 10,000+ inquiries daily with 95% accuracy.",
    image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&h=500&fit=crop",
  },
  {
    title: "Document Processing Automation",
    client: "LegalPro",
    category: "AI Automation",
    tags: ["UiPath", "OCR", "Machine Learning"],
    description:
      "Automated document processing system reducing manual data entry time by 90% and improving accuracy to 99.5%.",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=500&fit=crop",
  },
  {
    title: "Supply Chain Management System",
    client: "LogisticsPro",
    category: "Web Development",
    tags: ["Vue.js", "Django", "MongoDB"],
    description:
      "End-to-end supply chain management platform with real-time tracking, inventory management, and predictive analytics.",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=500&fit=crop",
  },
];

const categories = ["All", "Web Development", "Mobile Development", "Data Analysis", "AI Integration", "AI Automation"];

const Portfolio = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="py-20 gradient-hero">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Our <span className="text-gradient">Portfolio</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Discover how we've helped businesses transform their digital presence and achieve remarkable results
                through innovative IT solutions.
              </p>
            </div>
          </div>
        </section>

        {/* Filter Section */}
        <section className="py-8 bg-background sticky top-16 z-40 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={category === "All" ? "default" : "outline"}
                  className="cursor-pointer whitespace-nowrap hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <Card
                  key={index}
                  className="group hover:shadow-strong transition-all duration-300 overflow-hidden gradient-card border-border"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                      <Badge variant="default" className="gap-1">
                        View Case Study
                        <ExternalLink className="h-3 w-3" />
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="pt-4">
                    <div className="mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {project.category}
                      </Badge>
                    </div>
                    <h3 className="font-bold text-lg mb-1">{project.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">Client: {project.client}</p>
                    <p className="text-sm text-muted-foreground mb-4">{project.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {project.tags.map((tag, i) => (
                        <span key={i} className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">500+</div>
                <div className="text-sm text-muted-foreground">Projects Delivered</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">98%</div>
                <div className="text-sm text-muted-foreground">Client Satisfaction</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">50+</div>
                <div className="text-sm text-muted-foreground">Industry Awards</div>
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

export default Portfolio;
