'use client';

import { Home, Shield, Brain, Cloud, Film, Wallet, Github } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <nav className="flex justify-between items-center mb-16">
          <div className="flex items-center space-x-2">
            <Shield className="w-8 h-8 text-dawn-500" />
            <h1 className="text-2xl font-bold">CipherHome</h1>
          </div>
          <div className="flex space-x-4">
            <Link href="/dashboard" className="btn btn-secondary">
              Dashboard
            </Link>
            <Link href="/login" className="btn btn-primary">
              Get Started
            </Link>
          </div>
        </nav>

        <div className="text-center max-w-4xl mx-auto mb-20">
          <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-dawn-400 to-dawn-600">
            Your Black Box,
            <br />
            Your Digital Kingdom
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            Take back control with CipherHome - a sovereign personal cloud operating system
            built for the DAWN Black Box. Privacy-first. AI-powered. Fully self-hosted.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login" className="btn btn-primary text-lg px-8 py-3">
              Launch App
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary text-lg px-8 py-3 flex items-center gap-2"
            >
              <Github className="w-5 h-5" />
              View on GitHub
            </a>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          <FeatureCard
            icon={<Brain className="w-12 h-12 text-dawn-500" />}
            title="Private AI Assistant"
            description="Personal ChatGPT that learns from your data locally. No cloud, no surveillance."
          />
          <FeatureCard
            icon={<Cloud className="w-12 h-12 text-dawn-500" />}
            title="Family Cloud Storage"
            description="Encrypted alternative to Google Drive and iCloud. Your files, your rules."
          />
          <FeatureCard
            icon={<Film className="w-12 h-12 text-dawn-500" />}
            title="Media Server"
            description="Stream your photos, videos, and music. AI-powered organization included."
          />
          <FeatureCard
            icon={<Home className="w-12 h-12 text-dawn-500" />}
            title="Smart Home Hub"
            description="Control all IoT devices privately without Big Tech intermediaries."
          />
          <FeatureCard
            icon={<Shield className="w-12 h-12 text-dawn-500" />}
            title="Encrypted Messaging"
            description="Signal-like P2P messaging between Black Boxes. Zero-knowledge."
          />
          <FeatureCard
            icon={<Wallet className="w-12 h-12 text-dawn-500" />}
            title="Blockchain Identity"
            description="Sovereign identity on Solana. Earn crypto by sharing resources."
          />
        </div>

        {/* Why Section */}
        <div className="card max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold mb-6 text-center">Why CipherHome?</h3>
          <div className="space-y-4 text-lg text-gray-300">
            <p>
              🔐 <strong className="text-white">Radical Privacy:</strong> All data stays on YOUR
              Black Box. No cloud sync, no corporate surveillance.
            </p>
            <p>
              🤖 <strong className="text-white">Local AI:</strong> Train AI on your life without
              sending anything to OpenAI, Google, or Meta.
            </p>
            <p>
              🌐 <strong className="text-white">P2P Network:</strong> Connect directly with family
              Black Boxes. No middlemen.
            </p>
            <p>
              💰 <strong className="text-white">Earn Crypto:</strong> Share excess
              bandwidth/compute and get paid in crypto.
            </p>
            <p>
              🏛️ <strong className="text-white">Sovereign Tech:</strong> Replace 10+ Big Tech
              services with one device you own.
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-20 text-center text-gray-400">
          <p className="mb-2">Built for the DAWN Cypherpunk Hackathon 2025</p>
          <p className="text-sm">
            Powered by Solana • Ollama • MinIO • Jellyfin • Open Source
          </p>
        </footer>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="card hover:border-dawn-500 transition-all cursor-pointer">
      <div className="mb-4">{icon}</div>
      <h4 className="text-xl font-bold mb-2">{title}</h4>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}
