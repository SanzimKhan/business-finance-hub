import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card } from '@/components/ui/card';
import {
  Network,
  ShoppingCart,
  Bot,
  GraduationCap,
  Package,
  Trophy,
  Warehouse,
  FlaskConical,
  Banknote,
  Users,
  Building2,
  Cog,
  Rocket,
  Globe,
} from 'lucide-react';

const ecosystemItems = [
  {
    title: 'E-Commerce',
    description: 'Online store selling robotics kits, components, and educational materials to customers across Bangladesh and beyond.',
    icon: ShoppingCart,
    color: 'from-blue-500/20 to-blue-600/10',
    iconColor: 'text-blue-500',
    features: ['Product catalog', 'Order management', 'Payment gateway', 'Shipping integration'],
  },
  {
    title: 'Robotics Services',
    description: 'Custom robotics solutions for businesses, automation projects, and industrial applications.',
    icon: Bot,
    color: 'from-purple-500/20 to-purple-600/10',
    iconColor: 'text-purple-500',
    features: ['Custom robot design', 'Automation solutions', 'IoT integration', 'Maintenance support'],
  },
  {
    title: 'EdTech Platform',
    description: 'Online and offline courses teaching robotics, programming, electronics, and STEM skills to students of all ages.',
    icon: GraduationCap,
    color: 'from-green-500/20 to-green-600/10',
    iconColor: 'text-green-500',
    features: ['Online courses', 'Live workshops', 'Certifications', 'Skill assessments'],
  },
  {
    title: 'Robotics Kits',
    description: 'Ready-to-assemble robotics kits for beginners and advanced learners with comprehensive guides.',
    icon: Package,
    color: 'from-orange-500/20 to-orange-600/10',
    iconColor: 'text-orange-500',
    features: ['Beginner kits', 'Advanced kits', 'Competition kits', 'Educational bundles'],
  },
  {
    title: 'Competitions',
    description: 'Organizing and participating in national and international robotics competitions.',
    icon: Trophy,
    color: 'from-yellow-500/20 to-yellow-600/10',
    iconColor: 'text-yellow-500',
    features: ['National events', 'School competitions', 'Hackathons', 'Innovation challenges'],
  },
  {
    title: 'Inventory Management',
    description: 'Comprehensive tracking of components, finished products, and raw materials across all operations.',
    icon: Warehouse,
    color: 'from-slate-500/20 to-slate-600/10',
    iconColor: 'text-slate-500',
    features: ['Stock tracking', 'Reorder alerts', 'Supplier management', 'Cost analysis'],
  },
  {
    title: 'R&D Lab',
    description: 'Research and development center for innovation, prototyping, and new product development.',
    icon: FlaskConical,
    color: 'from-cyan-500/20 to-cyan-600/10',
    iconColor: 'text-cyan-500',
    features: ['Prototyping', 'Product testing', 'Innovation research', 'Patent development'],
  },
  {
    title: 'Finance Department',
    description: 'Managing all financial operations including accounting, payroll, investments, and budgeting.',
    icon: Banknote,
    color: 'from-emerald-500/20 to-emerald-600/10',
    iconColor: 'text-emerald-500',
    features: ['Accounting', 'Payroll', 'Budgeting', 'Financial reporting'],
  },
  {
    title: 'HR & Team',
    description: 'Human resources management, team building, recruitment, and employee development.',
    icon: Users,
    color: 'from-pink-500/20 to-pink-600/10',
    iconColor: 'text-pink-500',
    features: ['Recruitment', 'Training', 'Performance reviews', 'Team building'],
  },
];

const companyStats = [
  { label: 'Business Verticals', value: '9+', icon: Building2 },
  { label: 'Team Members', value: '15+', icon: Users },
  { label: 'Products', value: '50+', icon: Package },
  { label: 'Students Trained', value: '1000+', icon: GraduationCap },
];

export default function EcosystemPage() {
  return (
    <MainLayout>
      <div className="space-y-8 animate-fade-in">
        <PageHeader
          title="BOT Engineers Ecosystem"
          description="Complete overview of our robotics and EdTech business ecosystem"
          icon={Network}
        />

        {/* Company Overview */}
        <Card className="p-8 bg-gradient-to-br from-primary/10 via-accent/5 to-background">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 rounded-2xl bg-primary/20">
              <Rocket className="h-10 w-10 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">BOT Engineers</h2>
              <p className="text-muted-foreground">Bangladesh's Leading Robotics & EdTech Company</p>
            </div>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            BOT Engineers is a pioneering robotics and educational technology company based in Bangladesh. 
            We are dedicated to advancing STEM education, developing innovative robotics solutions, 
            and building the next generation of engineers and innovators.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {companyStats.map((stat) => (
              <div key={stat.label} className="text-center p-4 rounded-xl bg-card">
                <div className="h-6 w-6 mx-auto mb-2 text-primary"><stat.icon className="h-6 w-6" /></div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Ecosystem Grid */}
        <div>
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Cog className="h-6 w-6" />
            Business Verticals
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ecosystemItems.map((item) => (
              <Card 
                key={item.title} 
                className={`p-6 bg-gradient-to-br ${item.color} hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`p-3 rounded-xl bg-card ${item.iconColor}`}>
                    <item.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                <div className="space-y-2">
                  {item.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {feature}
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Vision & Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="h-6 w-6 text-primary" />
              <h3 className="font-semibold text-lg">Our Vision</h3>
            </div>
            <p className="text-muted-foreground">
              To be the leading force in robotics education and innovation in Bangladesh, 
              empowering the next generation with cutting-edge technology skills and 
              creating world-class robotics solutions.
            </p>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Rocket className="h-6 w-6 text-primary" />
              <h3 className="font-semibold text-lg">Our Mission</h3>
            </div>
            <p className="text-muted-foreground">
              To democratize robotics education, provide affordable and high-quality 
              robotics kits, and deliver innovative automation solutions that help 
              businesses and individuals thrive in the age of technology.
            </p>
          </Card>
        </div>

        {/* Organizational Structure */}
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
            <Users className="h-5 w-5" />
            Organizational Structure
          </h3>
          <div className="relative">
            {/* CEO */}
            <div className="flex justify-center mb-8">
              <div className="text-center p-4 rounded-xl bg-primary/10 border-2 border-primary/30">
                <p className="font-semibold">MD Sanzim Rahman Khan</p>
                <p className="text-sm text-muted-foreground">Founder & CEO</p>
              </div>
            </div>
            
            {/* C-Level */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="text-center p-3 rounded-xl bg-accent/10">
                <p className="font-medium text-sm">MD Ali Razin</p>
                <p className="text-xs text-muted-foreground">Co-Founder & CMO</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-accent/10">
                <p className="font-medium text-sm">Saadat S Rahman</p>
                <p className="text-xs text-muted-foreground">CTO</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-accent/10">
                <p className="font-medium text-sm">Muztahid Durjoy</p>
                <p className="text-xs text-muted-foreground">Chief Software Engineer</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-accent/10">
                <p className="font-medium text-sm">Dipanjan</p>
                <p className="text-xs text-muted-foreground">Chief Mechatronics Engineer</p>
              </div>
            </div>

            {/* Other Leaders */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="text-center p-3 rounded-xl bg-muted/50">
                <p className="font-medium text-sm">Rubaiayat</p>
                <p className="text-xs text-muted-foreground">Chief Instructor</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-muted/50">
                <p className="font-medium text-sm">Dr. Khalilur Rahman</p>
                <p className="text-xs text-muted-foreground">Advisor</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}
