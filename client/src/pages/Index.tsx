import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/home/Hero";
import Services from "@/components/home/Services";
import HowItWorks from "@/components/home/HowItWorks";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Testimonials from "@/components/home/Testimonials";
import CTA from "@/components/home/CTA";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { login, setStatus } from "../store/authSlice"

const Index = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const initAuth = async () => {
      try {
        const res = await fetch('/api/auth/refresh', {
          method: 'POST',
          credentials: 'include'  // sends cookies
        });

        if (!res.ok) throw new Error("Not authenticated");

        const data = await res.json();
        dispatch(login({ user: data.user, accessToken: data.accessToken}));
        dispatch(setStatus("authenticated"));

      } catch (error) {
        console.log("An error occured: ", error);
      }
    }
    initAuth();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Services />
        <HowItWorks />
        <WhyChooseUs />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
