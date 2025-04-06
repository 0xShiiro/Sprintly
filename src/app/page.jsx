import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight, ArrowRight } from "lucide-react";
import { Layout, Calendar, BarChart } from "lucide-react";
import faqs from "../../data/faqs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CompanyCarousel from "@/components/CompanyCarousel";
const features = [
  {
    title: "Intuitive Kanban Boards",
    description:
      "Visualize your workflow and optimize team productivity with our easy-to-use Kanban boards.",
    icon: Layout,
  },
  {
    title: "Powerful Sprint Planning",
    description:
      "Plan and manage sprints effectively, ensuring your team stays focused on delivering value.",
    icon: Calendar,
  },
  {
    title: "Comprehensive Reporting",
    description:
      "Gain insights into your team's performance with detailed, customizable reports and analytics.",
    icon: BarChart,
  },
];
export default async function Home() {

  return (
    <div>
      {/* Hero Section */}
      <section className="container mx-auto py-20 text-center">
        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-extrabold gradient-title pb-6 mb-4">
          Streamline Your WorkFlow
          <br />
          <span className="flex mx-auto gap-3 sm:gap-4 items-center justify-center">
            with{" "}
            <Image
              src="/logo2.png"
              alt="Sprintly Logo"
              width={400}
              height={80}
              className="h-14 sm:h-24 w-auto object-contain"
            />
          </span>
        </h1>
        <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
          Empower Your team with our intuitive project management solution.
        </p>
        <Link href="/onboarding">
          <Button
            size="lg"
            href="/onboarding"
            className="mr-5 bg-white text-black"
          >
            Get Started <ChevronRight size={18} className="ml-1" />
          </Button>
        </Link>
        <Link href="#features">
          <Button size="lg" variant="outline" className="mr-4">
            Learn More
          </Button>
        </Link>
      </section>
      <section id="features" className="bg-gray-900 py-20 px-5">
        <div className="container mx-auto">
          <h3 className="text-5xl font-bold mb-12 text-center">Key Features</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              return (
                <Card key={index} className="bg-gray-800">
                  <CardContent className="pt-6">
                    <feature.icon className="h-12 w-12 mb-4 text-blue-300" />
                    <h4 className="text-xl font-semibold mb-2">
                      {feature.title}
                    </h4>
                    <p className="text-gray-300">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}{" "}
          </div>
        </div>
      </section>
      <section className=" py-20 ">
        <div className="container mx-auto">
          <h3 className="text-5xl font-bold mb-12 text-center">
            Trusted By Industry Leaders
          </h3>
          <CompanyCarousel />
        </div>
      </section>
      <section className=" bg-gray-900 py-20 px-5 ">
        <div className="container mx-auto">
          <h3 className="text-5xl font-bold mb-12 text-center">
            Frequently Asked Questions
          </h3>
          <Accordion type="single" collapsible className="w-full ">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-b-2 border-gray-800 "
              >
                <AccordionTrigger className="text-lg">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
      <section className=" py-20 text-center px-5">
        <div className="container mx-auto">
          <h3 className="text-5xl font-bold mb-12 text-center">
            Ready to Transform Your Workflow?
          </h3>
          <p className="text-gray-300">
            Join Thousands of teams already using Sprintly to streamline their
            workflow.
          </p>
          <Link href="/onboarding">
            <Button
              size="lg"
              className="mr-5 bg-white text-black mt-10 animate-bounce"
            >
              Start For Free <ArrowRight size={18} className="ml-1" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
