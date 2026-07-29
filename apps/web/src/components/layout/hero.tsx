import Link from "next/link"
import { Heading } from "../ui/heading"
import { Container } from "./container"
import { IconArrowRight } from "@tabler/icons-react"


export const Hero = () => {
  return (
    <div className="pt-10 md:pt-20 lg:pt-16">
      <Container>
        <p className="bg-[#1255BE] dark:bg-[#1255BE]/60 rounded-xl py-1 px-4 text-center text-neutral-200 dark:text-neutral-100 w-fit mx-auto text-xs mb-6">Introducing Aceprep An Interview Preparation Platform</p>
        <Heading as="h1" className="font-semibold text-center text-2xl md:text-4xl lg:text-5xl">Prepare Smarter for Technical Interviews  <br /> Using Real Interview Questions</Heading>

        <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 text-center py-6 font-inter">Stop relying on random resources. Prepare using curated interview questions, expert explanations, <br></br> and experiences shared by engineers from top tech companies.</p>

        <div className="flex items-center gap-6 justify-center">
          <Link href="/register">
            <button className="text-sm text-neutral-200 px-4 py-1.5 bg-foreground dark:bg-neutral-200 dark:text-neutral-800 rounded-lg active:scale-[0.97] shadow-brand flex items-center cursor-pointer">Start Free
              <IconArrowRight size={14} className="ml-2" />
            </button>
          </Link>

          <Link href="/questions">
            <button className="text-sm text-neutral-800 px-4 py-1.5  dark:text-neutral-200 bg-neutral-200 dark:bg-neutral-800 rounded-lg active:scale-[0.97] cursor-pointer">Browse Questions</button>
          </Link>
        </div>
      </Container>
    </div>
  )
}
