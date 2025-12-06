"use client";

import { useState, useEffect } from "react";

interface ContactData {
  mainTitle: string;
  backgroundTitle: string;
  description: string;
  email: string;
  phone: string;
  studioName: string;
  studioAddress: string;
  submitButtonText: string;
  successMessage: string;
  errorMessage: string;
}

const defaultData: ContactData = {
  mainTitle: "Contact\nUs",
  backgroundTitle: "Connect",
  description: "我們相信溝通的力量。每一次連結都是創造非凡作品的第一步。聯繫我們，讓我們一起開始創造真正卓越的事物。",
  email: "contact@rcollective.com",
  phone: "+886 2 1234 5678",
  studioName: "Our Studio",
  studioAddress: "台北市信義區\n某某路 123 號 5 樓",
  submitButtonText: "Send Message",
  successMessage: "訊息已成功送出！",
  errorMessage: "發送失敗，請稍後再試。",
};

export default function ContactPage() {
  const [data, setData] = useState<ContactData>(defaultData);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `query { contact { mainTitle backgroundTitle description email phone studioName studioAddress submitButtonText successMessage errorMessage } }`,
          }),
        });
        const { data: resData } = await res.json();
        if (resData?.contact) {
          setData({ ...defaultData, ...resData.contact });
        }
      } catch (error) {
        console.error("Failed to fetch contact data:", error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // 模擬提交
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmitStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const titleParts = data.mainTitle.split('\n');
  const addressLines = data.studioAddress.split('\n');

  return (
    <div className="min-h-screen bg-neutral-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="flex justify-between gap-8 lg:gap-16 items-start">
          {/* Left Column - Title & Info */}
          <div className=" space-y-12">
            <div className="relative">
              <h1
                aria-hidden="true"
                className="font-montserrat text-8xl md:text-9xl lg:text-[10rem] leading-none text-brand-primary uppercase absolute -top-8 lg:-top-12 -left-4 opacity-10 select-none"
              >
                {data.backgroundTitle}
              </h1>
              <h1 className="font-montserrat text-7xl md:text-8xl lg:text-9xl text-neutral-900 uppercase relative z-10">
                {titleParts.map((part, index) => (
                  <span key={index}>
                    {part}
                    {index < titleParts.length - 1 && <br />}
                  </span>
                ))}
              </h1>
            </div>

            <div className="space-y-6 text-neutral-300">
              <p className="text-lg leading-relaxed">
                {data.description}
              </p>

              <div className="pt-4 space-y-4 flex  gap-8" >
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <svg
                      className="h-5 w-5 text-brand-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                    </svg>
                    <a
                      className="hover:text-brand-primary transition-colors"
                      href={`mailto:${data.email}`}
                    >
                      {data.email}
                    </a>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg
                      className="h-5 w-5 text-brand-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                    </svg>
                    <span>{data.phone}</span>
                  </div>
                </div>
                <div className="relative ">

                  <div className="relative z-10 pl-4 border-l-2 border-brand-primary">
                    <h3 className="font-bold text-neutral-900">{data.studioName}</h3>
                    <p className="text-neutral-300">
                      {addressLines.map((line, index) => (
                        <span key={index}>
                          {line}
                          {index < addressLines.length - 1 && <br />}
                        </span>
                      ))}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form & Images */}
          <div className="w-full">
            <div className="flex flex-col h-full min-h-[600px] lg:min-h-0 w-full">
              {/* Top Form - Name & Email */}
              <div className="col-span-2 row-span-1 relative glassmorphism p-6 rounded-lg">
                <div className="space-y-4">
                  <input
                    className="w-full bg-transparent border-b border-neutral-200 focus:border-brand-primary focus:ring-0 placeholder-neutral-300 text-neutral-900 transition py-2 outline-none"
                    name="name"
                    placeholder="Your Name"
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                  <input
                    className="w-full bg-transparent border-b border-neutral-200 focus:border-brand-primary focus:ring-0 placeholder-neutral-300 text-neutral-900 transition py-2 outline-none"
                    name="email"
                    placeholder="Your Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Main Form - Message */}
              <div className="col-span-2 row-span-2 relative glassmorphism p-6 rounded-lg">
                <form className="h-full flex flex-col" onSubmit={handleSubmit}>
                  <textarea
                    className="w-full flex-grow bg-transparent border-b border-neutral-200 focus:border-brand-primary focus:ring-0 placeholder-neutral-300 text-neutral-900 transition resize-none py-2 outline-none"
                    name="message"
                    placeholder="Your Message..."
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                  />
                  <div className="mt-4 flex items-center justify-between">
                    {submitStatus === "success" && (
                      <span className="text-green-600 text-sm">
                        {data.successMessage}
                      </span>
                    )}
                    {submitStatus === "error" && (
                      <span className="text-red-600 text-sm">
                        {data.errorMessage}
                      </span>
                    )}
                    <button
                      className="ml-auto bg-brand-primary text-white font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : data.submitButtonText}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom styles */}
      <style jsx>{`
        .glassmorphism {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
}
