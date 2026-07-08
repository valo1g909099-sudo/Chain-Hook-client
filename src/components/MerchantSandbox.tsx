import { useState } from 'react';
import { ShoppingBag, ShieldCheck, CheckCircle2, XCircle, ArrowLeft, ArrowUpRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { useSearchParams, useNavigate } from 'react-router-dom';

interface Product {
    id: string;
    name: string;
    description: string;
    price: string;
    image: string;
    color: string;
}

const PRODUCTS: Product[] = [
    {
        id: 'p1',
        name: 'AeroSound Max Pro',
        description: 'Active Noise Cancelling Wireless Over-Ear Headphones with Spatial Audio.',
        price: '$249.00',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
        color: 'from-blue-600/20 to-indigo-600/20 hover:border-indigo-500/50'
    },
    {
        id: 'p2',
        name: 'CyberTactile Keyboard',
        description: 'Gasket-mounted mechanical keyboard with customizable RGB & hot-swappable switches.',
        price: '$129.50',
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80',
        color: 'from-amber-600/20 to-orange-600/20 hover:border-orange-500/50'
    },
    {
        id: 'p3',
        name: 'Vivid Chrono Series 5',
        description: 'Retina AMOLED screen, bio-sensor array, and custom aerospace titanium casing.',
        price: '$310.00',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
        color: 'from-emerald-600/20 to-teal-600/20 hover:border-teal-500/50'
    }
];

export default function MerchantSandbox() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const isSuccess   = searchParams.get('payment_success') === 'true';
    const isCancelled = searchParams.get('payment_cancelled') === 'true';
    const amountPaid  = searchParams.get('amount') || '$0.00';
    const txId        = searchParams.get('tx_id') || 'TX-UNKNOWN';

    const handleCheckout = (product: Product) => {
        const payload = {
            platform_name: "Nova Store",
            platform_url: "MerchantSandbox",
            type: "payment",
            merchant_name: "Nova Store",
            total_price: product.price
        };
        const jsonStr = JSON.stringify(payload);
        const encoded = btoa(unescape(encodeURIComponent(jsonStr)));
        
        navigate(`/authorize?client_id=${encoded}`);
    };

    const handleClearParams = () => {
        setSearchParams({});
    };

    // Render payment success receipt screen
    if (isSuccess) {
        return (
            <div className="p-8 max-w-4xl mx-auto min-h-[80vh] flex flex-col justify-center items-center text-white">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-lg p-8 rounded-3xl border border-[#3EC6C0]/30 bg-[#0A0A0E]/80 backdrop-blur-xl shadow-2xl relative overflow-hidden"
                >
                    {/* Glowing effect */}
                    <div className="absolute top-[-20%] left-[-20%] w-64 h-64 bg-[#3EC6C0]/10 rounded-full blur-[80px]"></div>

                    <div className="flex flex-col items-center text-center mb-8 relative z-10">
                        <div className="p-4 rounded-full bg-[#3EC6C0]/10 border border-[#3EC6C0]/30 text-[#3EC6C0] mb-4 shadow-lg animate-bounce">
                            <CheckCircle2 size={36} />
                        </div>
                        <h2 className="text-xl font-bold tracking-tight mb-1">Order Confirmed!</h2>
                        <p className="text-xs text-[#71717A] uppercase tracking-wider">Nova Store Checkout</p>
                    </div>

                    <div className="bg-[#121217] p-5 rounded-2xl border border-[#27272A] space-y-4 mb-8 relative z-10">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-[#9A9AA5]">Merchant:</span>
                            <span className="font-semibold text-white">Nova Store (Verified)</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-[#9A9AA5]">Transaction ID:</span>
                            <span className="font-mono text-[#D4AF37] font-semibold">{txId}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-[#9A9AA5]">Payment Method:</span>
                            <span className="flex items-center gap-1 text-[#D4AF37] font-medium">
                                <ShieldCheck size={14} /> Chain Hook Secure OAuth
                            </span>
                        </div>
                        <div className="border-t border-[#27272A] pt-4 flex justify-between items-center">
                            <span className="text-sm font-semibold text-white">Total Paid:</span>
                            <span className="text-lg font-bold text-[#3EC6C0]">{amountPaid}</span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 relative z-10">
                        <button
                            onClick={handleClearParams}
                            className="flex-1 flex items-center justify-center gap-2 p-3.5 rounded-xl border border-[#27272A] bg-[#0A0A0E] text-xs font-semibold text-[#A1A1AA] hover:border-[#D4AF37]/30 hover:text-white transition-all duration-300"
                        >
                            <ShoppingBag size={14} /> Keep Shopping
                        </button>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="flex-1 flex items-center justify-center gap-2 p-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8962E] hover:from-[#E3C053] hover:to-[#C6A238] text-[#050508] text-xs font-bold hover:shadow-lg hover:shadow-[#D4AF37]/20 transition-all duration-300"
                        >
                            Go to Chain Hook <ArrowUpRight size={14} />
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    // Render payment cancelled/error screen
    if (isCancelled) {
        return (
            <div className="p-8 max-w-4xl mx-auto min-h-[80vh] flex flex-col justify-center items-center text-white">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-lg p-8 rounded-3xl border border-red-500/20 bg-[#0A0A0E]/80 backdrop-blur-xl shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute top-[-20%] left-[-20%] w-64 h-64 bg-red-500/5 rounded-full blur-[80px]"></div>

                    <div className="flex flex-col items-center text-center mb-8 relative z-10">
                        <div className="p-4 rounded-full bg-red-500/10 border border-red-500/30 text-red-500 mb-4 shadow-lg">
                            <XCircle size={36} />
                        </div>
                        <h2 className="text-xl font-bold tracking-tight mb-1">Payment Cancelled</h2>
                        <p className="text-xs text-[#71717A] uppercase tracking-wider">The consent request was declined</p>
                    </div>

                    <p className="text-xs text-[#9A9AA5] text-center mb-8 leading-relaxed">
                        Your payment authorization request was denied, or the process was canceled. No funds have been deducted from your Chain Hook account. If you wish to complete the checkout, please try again.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 relative z-10">
                        <button
                            onClick={handleClearParams}
                            className="w-full flex items-center justify-center gap-2 p-3.5 rounded-xl bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/30 hover:border-red-500/60 text-red-200 text-xs font-semibold transition-all duration-300"
                        >
                            <ArrowLeft size={14} /> Back to Storefront
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-6xl mx-auto text-white space-y-8">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#1F1F23] pb-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <ShoppingBag className="text-[#D4AF37]" size={20} />
                        <h2 className="text-lg font-bold tracking-tight">Nova Store</h2>
                        <span className="text-[9px] uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">OAuth Sandbox Mode</span>
                    </div>
                    <p className="text-xs text-[#9A9AA5]">This is a simulated third-party online store integrated with Chain Hook OAuth 2.0 Secure Pay API.</p>
                </div>
                <div className="flex items-center gap-2 text-xs bg-[#1C1C24] p-3 rounded-xl border border-[#27272A]">
                    <ShieldCheck className="text-[#D4AF37]" size={16} />
                    <span className="text-[#A1A1AA]">Security:</span>
                    <span className="text-white font-medium">OAuth 2.0 PKCE Active</span>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {PRODUCTS.map((product) => (
                    <motion.div
                        key={product.id}
                        whileHover={{ y: -4 }}
                        className="rounded-2xl border border-[#27272A] bg-[#121217]/50 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl"
                    >
                        <div className="h-44 overflow-hidden relative group">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#121217] to-transparent opacity-80"></div>
                            <span className="absolute top-4 right-4 bg-[#0A0A0E]/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-mono font-bold text-[#D4AF37] border border-[#27272A]">
                                {product.price}
                            </span>
                        </div>

                        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                            <div>
                                <h3 className="text-sm font-semibold text-white mb-2">{product.name}</h3>
                                <p className="text-xs text-[#71717A] leading-relaxed line-clamp-3">{product.description}</p>
                            </div>

                            <button
                                onClick={() => handleCheckout(product)}
                                className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-[#D4AF37] hover:bg-[#E3C053] text-[#050508] text-xs font-bold transition-all duration-300 hover:shadow-lg hover:shadow-[#D4AF37]/10"
                            >
                                Buy with Chain Hook <ArrowUpRight size={14} />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="p-6 rounded-2xl bg-[#0D0D12] border border-[#27272A] space-y-4">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Sparkles size={14} className="text-[#D4AF37]" /> How does the OAuth flow work here?
                </h4>
                <ol className="text-xs text-[#9A9AA5] space-y-3 list-decimal pl-4 leading-relaxed">
                    <li>Clicking <span className="text-[#D4AF37] font-semibold">Buy with Chain Hook</span> navigates to <code className="text-[#3EC6C0]">/authorize</code> with OAuth query parameters.</li>
                    <li>If you are not logged in, Chain Hook will capture the query and prompt you to sign in with your credentials first.</li>
                    <li>Once logged in (or if already authenticated), you will be taken to a beautiful, dedicated security consent layer to review the merchant's payment parameters.</li>
                    <li>You can choose which currency wallet to pay from, review active conversion rates, and hit Approve.</li>
                    <li>Chain Hook handles authorization token callbacks and redirects you back here with a mock authorization code to display the payment receipt.</li>
                </ol>
            </div>
        </div>
    );
}
