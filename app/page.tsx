// app/page.tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Coffee, Bike, Clock, MapPin } from 'lucide-react'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4">
          ☕ CUHK Coffee Delivery
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Fresh coffee delivered to your dorm by fellow students
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/menu">
            <Button size="lg" className="text-lg">
              Order Now
            </Button>
          </Link>
          <Link href="/delivery">
            <Button size="lg" variant="outline" className="text-lg">
              Become a Delivery Partner
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-8 mb-16">
        <FeatureCard
          icon={<Coffee className="w-12 h-12" />}
          title="Quality Coffee"
          description="Freshly brewed from our student café"
        />
        <FeatureCard
          icon={<Bike className="w-12 h-12" />}
          title="Fast Delivery"
          description="5-15 minutes across campus"
        />
        <FeatureCard
          icon={<Clock className="w-12 h-12" />}
          title="Real-time Tracking"
          description="Know exactly when your order arrives"
        />
        <FeatureCard
          icon={<MapPin className="w-12 h-12" />}
          title="Campus-wide"
          description="Delivering to all colleges and buildings"
        />
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <StepCard
            number="1"
            title="Browse Menu"
            description="Choose from our selection of coffee, tea, and snacks"
          />
          <StepCard
            number="2"
            title="Place Order"
            description="Select your delivery location on campus"
          />
          <StepCard
            number="3"
            title="Receive Coffee"
            description="A student delivery partner brings it to you!"
          />
        </div>
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { 
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-center">
      <div className="flex justify-center text-blue-600 mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  )
}

function StepCard({ number, title, description }: {
  number: string
  title: string
  description: string
}) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
        {number}
      </div>
      <h3 className="font-semibold text-xl mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}