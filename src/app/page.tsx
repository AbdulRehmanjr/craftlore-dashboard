import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "~/components/forms/login-form";

export default function HomePage() {
  return (
    <main className="col-span-12 flex min-h-screen w-full bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
      {/* Login Section */}
      <section className="flex w-full items-center justify-center lg:w-1/2">
        <div className="w-[380px] max-w-full rounded-xl bg-white/90 p-8 shadow-lg backdrop-blur-sm dark:bg-gray-800/70 dark:shadow-gray-900/20">
          <div className="relative flex h-24 justify-center">
            <Image
              src="/logo.png"
              alt="Craftlore logo"
              className="object-contain drop-shadow-md"
              fill
            />
          </div>
          
          <h1 className="mb-6 text-center text-2xl font-medium tracking-wide text-secondary">
            Welcome to <span className="font-bold">Craftlore</span>
          </h1>
          
          <LoginForm />
          
          <div className="mt-4 text-center">
            <p className="text-xs text-primary">
              First time here? <Link href="/register" className="text-secondary hover:text-secondary/80">Create an account</Link>
            </p>
          </div>
        </div>
      </section>
      
      {/* Craft Content Showcase Section */}
      <section className="hidden w-1/2 lg:block">
        <div className="relative h-full w-full overflow-hidden">
          {/* Background Image with Overlay */}
          <Image
            src="/login.jpg"
            alt="Crafting workspace with tools and materials"
            className="object-cover object-center dark:brightness-[0.8]"
            fill
            sizes="50vw"
            priority
          />
          
          {/* Content Container with Craft Theme */}
          <div className="absolute inset-0 bg-gradient-to-t from-amber-900/80 via-amber-800/50 to-transparent">
            <div className="absolute inset-0 flex flex-col items-center justify-between p-10 text-white">
              {/* Top Section with Branding */}
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-2 h-10 w-10 rounded-full bg-white/20 p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                    </svg>
                  </div>
                  <span className="text-lg font-medium tracking-wide">CRAFTLORE</span>
                </div>
                <div className="rounded-full bg-white/10 px-3 py-1 text-xs backdrop-blur-md">ORGANIZE · CREATE · THRIVE</div>
              </div>
              
              {/* Middle Content - Main Heading and Features */}
              <div className="max-w-lg text-center">
                <h2 className="mb-6 text-4xl font-light leading-tight tracking-wide">
                  Your all-in-one tool to <span className="font-bold text-secondary">manage</span> your crafting journey
                </h2>
                
                <p className="mb-8 text-lg font-light text-primary">
                  Track supplies, organize projects, and connect with fellow crafters in one beautiful platform.
                </p>
                
                {/* Feature Cards */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { title: "Inventory", desc: "Track all your supplies" },
                    { title: "Projects", desc: "Organize your WIPs" },
                    { title: "Inspiration", desc: "Save ideas & patterns" },
                    { title: "Community", desc: "Share & learn together" }
                  ].map((feature) => (
                    <div key={feature.title} className="rounded-xl bg-white/5 p-4 text-left backdrop-blur-md transition-all hover:bg-white/10">
                      <h3 className="text-lg font-medium text-white">{feature.title}</h3>
                      <p className="text-sm text-white">{feature.desc}</p>
                    </div>
                  ))}
                </div>
                
                {/* Craft Categories */}
                <div className="mt-8">
                  <div className="mb-2 text-left text-xs uppercase tracking-wider text-white">Popular Craft Categories</div>
                  <div className="flex flex-wrap gap-2">
                    {["Knitting", "Crochet", "Sewing", "Embroidery", "Quilting", "Pottery"].map((tag) => (
                      <span key={tag} className="rounded-full border border-white/20 px-3 py-1 text-sm transition-colors hover:bg-white/10">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Bottom Section - Testimonial and Contact */}
              <div className="w-full">
                <div className="mb-6 flex items-start space-x-4 rounded-lg bg-black/20 p-4 backdrop-blur-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                    <span className="text-sm font-bold">EC</span>
                  </div>
                  <div>
                    <p className="mb-1 text-sm italic text-white">&quot;Craftlore has transformed how I organize my yarn stash and track my knitting projects. I can finally see everything I have at a glance!&quot;</p>
                    <p className="text-xs text-white">— Emma C., Premium Member</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-light text-white">Questions or support?</p>
                    <Link 
                      className="text-sm text-white transition-colors hover:text-secondary/80" 
                      href="mailto:office@craftlore.com"
                    >
                      office@craftlore.com
                    </Link>
                  </div>
                  <Link
                    className="rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur-sm transition-all hover:bg-white/20"
                    href="https://wa.me/0032432432432"
                    target="_blank"
                  >
                    WhatsApp Support
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}