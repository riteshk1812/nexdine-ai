import { ShoppingBag, Package, Users, BrainCircuit } from 'lucide-react';

const modules = [
    {
        title: "Products",
        description: "Manage product catalog and inventory",
        icon: Package,
    },
    {
        title: "Orders",
        description: "Manage customer orders",
        icon: ShoppingBag,
    },
    {
        title: "Customers",
        description: "Manage users and customer profiles",
        icon: Users,
    },
    {
        title: "AI Assistant",
        description: "AI-powered shopping assistant",
        icon: BrainCircuit,
    },
]

export default function HomePage() {
    return (
        <main className='min-h-screen bg-slate-950 text-white'>
            <header className='border-b border-slate-800 px-8 py-5'>
                <h1 className='text-2xl font-bold'>
                    NexCommerce AI
                </h1>
                <p className='mt-1 text-sm text-slate-400'>
                    Intelligent Commerce Management Platform
                </p>
            </header>
            <section className='mx-auto max-w-7xl px-8 py-12'>
                <h2 className='text-2xl font-bold'>
                    Welcome to your Dashboard!!
                </h2>

                <p className="mt-2 text-slate-400">
                    Manage your commerce platform from one place.
                </p>
                <div className='mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
                    {modules.map(({ title, description, icon: Icon }) => (
                        <div key={title} className='rounded-xl border border-slate-800 bg-slate-900 p-6'>
                            <Icon size={28} className='text-blue-400' />
                            <h3 className='mt-5 text-lg font-semibold'>{title}</h3>
                            <p className='mt-2 text-sm text-slate-400'>{description}</p>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    )
}