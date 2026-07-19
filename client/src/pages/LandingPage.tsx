import { Link } from 'react-router-dom'
import { FileText, Zap, LayoutTemplate, Download, ArrowRight } from 'lucide-react'
import ResumePreview from '../components/ResumePreview'
import { emptyResumeContent } from '../lib/types'

const sampleContent = {
  ...emptyResumeContent,
  personalInfo: {
    fullName: 'Jordan Vance',
    email: 'jordan@example.com',
    phone: '(555) 012-3344',
    location: 'San Francisco, CA',
    summary: 'Product designer with 6 years building 0→1 experiences for high-growth SaaS teams.',
  },
  experience: [
    {
      company: 'Northwind',
      role: 'Senior Product Designer',
      startDate: '2022',
      endDate: 'Present',
      description: 'Led design for a 0→1 product used by 40K weekly users, cutting onboarding drop-off 28%.',
    },
  ],
  skills: ['Figma', 'Design systems', 'User research', 'Prototyping'],
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface text-ink font-sans">
      <header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <FileText size={16} className="text-white" strokeWidth={2.25} />
          </div>
          <span className="font-display font-semibold text-[15px]">ResumeForge</span>
        </div>
        <nav className="flex items-center gap-6 text-sm">
          <Link to="/login" className="text-ink-soft hover:text-ink">
            Log in
          </Link>
          <Link
            to="/register"
            className="bg-primary text-white rounded-xl px-4 py-2 font-medium hover:bg-primary-hover transition-colors"
          >
            Get started
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-12 pb-24 grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-16 items-center">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/8 px-3 py-1 rounded-full mb-5">
            <Zap size={12} /> Built for the modern job search
          </span>
          <h1 className="font-display text-5xl sm:text-6xl font-semibold leading-[1.05] tracking-tight mb-6">
            Build a resume that
            <br />
            actually gets <span className="text-primary">read</span>.
          </h1>
          <p className="text-ink-soft text-lg max-w-md leading-relaxed mb-8">
            A focused editor, live preview, and clean export — everything you need to go from
            blank page to submitted application in one sitting.
          </p>
          <div className="flex items-center gap-5">
            <Link
              to="/register"
              className="flex items-center gap-2 bg-primary text-white rounded-xl px-6 py-3 font-medium hover:bg-primary-hover transition-colors shadow-sm"
            >
              Start for free <ArrowRight size={16} />
            </Link>
            <Link to="/login" className="text-sm text-ink-soft hover:text-ink underline underline-offset-4">
              I already have an account
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-6 bg-primary/5 rounded-3xl blur-2xl" aria-hidden="true" />
          <div className="relative scale-[0.82] origin-top">
            <ResumePreview content={sampleContent} />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border bg-card">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="font-display text-3xl font-semibold mb-12">Everything you need, nothing you don't.</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <Feature
              icon={<Zap size={18} />}
              title="Live preview"
              body="See exactly what a recruiter sees, updating as you type — no surprises at export time."
            />
            <Feature
              icon={<LayoutTemplate size={18} />}
              title="Multiple templates"
              body="Switch between Modern, Minimal, and Executive layouts without re-entering your content."
            />
            <Feature
              icon={<Download size={18} />}
              title="One-click export"
              body="Turn your draft into a clean, print-ready PDF the moment it's ready to send."
            />
          </div>
        </div>
      </section>

      <footer className="max-w-6xl mx-auto px-6 py-10 flex items-center justify-between text-xs text-ink-faint">
        <span>ResumeForge — a resume builder.</span>
        <Link to="/register" className="hover:text-ink underline underline-offset-4">
          Start for free
        </Link>
      </footer>
    </div>
  )
}

function Feature({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div>
      <div className="w-10 h-10 rounded-xl bg-primary/8 text-primary flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-[15px] mb-1.5">{title}</h3>
      <p className="text-sm text-ink-soft leading-relaxed">{body}</p>
    </div>
  )
}
