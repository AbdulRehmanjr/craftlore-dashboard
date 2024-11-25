import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "~/components/forms/login-form";


export default function HomePage() {
  return (
    <main className="col-span-12 flex min-h-screen w-full">
      <section className="flex w-full items-center justify-center lg:w-1/2">
        <div className="w-[350px] max-w-full px-4">
          <div className="relative flex h-32 justify-center">
            <Image
              src="/logo.png"
              alt="logo image"
              className="object-contain"
              fill
            />
          </div>
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-5xl font-bold text-primary font-heading">Login</h1>
            <p className="text-balance text-sm text-muted-foreground font-text">
              Enter your credentials to access your account
            </p>
          </div>
          <LoginForm />
        </div>
      </section>
      <section className="hidden w-1/2 lg:block">
        <div className="relative h-full w-full">
          <Image
            src="/login.jpg"
            alt="Seychelles beach scenery"
            className="object-cover object-center dark:brightness-[0.2] dark:grayscale"
            fill
            sizes="50vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent">
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center text-white">
              <h2 className="mb-4 text-4xl font-bold">Nice to see you again</h2>
              <p className="mb-6 text-xl">Welcome to KolibriStay</p>
              <ul className="space-y-2 text-lg">
                <li>
                  Your all-in-one tool to manage your guesthouse hasslefree.
                </li>
              </ul>
              <div className="my-8 flex flex-col gap-2">
                <p className="text-sm">
                  If you have any problems logging in to your account please
                  contact:
                </p>
                <Link className="text-sm" href="mailto:office@kolibri-bs.com">
                  office@kolibri-bs.com
                </Link>
                <Link
                  className="text-sm"
                  href="https://wa.me/004369910969670"
                  target="_blank"
                >
                  004369910969670 (WhatsApp)
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
