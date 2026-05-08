/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Utensils, 
  MapPin, 
  Phone, 
  Mail, 
  Instagram, 
  Facebook, 
  Twitter, 
  Send, 
  MessageSquare, 
  X, 
  Menu as MenuIcon, 
  Calendar, 
  Users, 
  Clock,
  ChevronRight,
  Flame,
  Leaf,
  Mic,
  Volume2,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";

// --- Types & Data ---

type Category = 'All' | 'Starters' | 'Mains' | 'Desserts' | 'Drinks';
type Diet = 'veg' | 'non-veg';

interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: Category;
  diet: Diet;
  description: string;
}

const MENU_ITEMS: MenuItem[] = [
  // Starters
  { id: 1, name: "Tandoori Broccoli Tikka", price: 380, category: 'Starters', diet: 'veg', description: "Charred broccoli florets marinated in spiced yogurt and mustard oil." },
  { id: 2, name: "Smoked Duck Seekh Kebab", price: 550, category: 'Starters', diet: 'non-veg', description: "Tender duck mince with aromatic spices, smoke-infused." },
  { id: 3, name: "Truffle Naan Bruschetta", price: 420, category: 'Starters', diet: 'veg', description: "Mini naan topped with wild mushrooms, truffle oil, and goat cheese." },
  
  // Mains
  { id: 4, name: "Butter Chicken Risotto", price: 780, category: 'Mains', diet: 'non-veg', description: "Arborio rice cooked in a rich makhani gravy with tandoori chicken chunks." },
  { id: 5, name: "Lamb Rogan Josh Wellington", price: 1100, category: 'Mains', diet: 'non-veg', description: "Classic Rogan Josh encased in a flaky puff pastry, served with saffron jus." },
  { id: 6, name: "Paneer Makhani Ravioli", price: 690, category: 'Mains', diet: 'veg', description: "Handmade ravioli stuffed with paneer, tossed in a velvet tomato cream sauce." },
  { id: 7, name: "Prawn Gassi with Coconut Foam", price: 950, category: 'Mains', diet: 'non-veg', description: "Mangalorean style spiced prawns served with a delicate coconut milk air." },
  
  // Desserts
  { id: 8, name: "Gulab Jamun Cheesecake", price: 380, category: 'Desserts', diet: 'veg', description: "Deconstructed gulab jamun set in a creamy cardamom-infused cheesecake." },
  { id: 9, name: "Saffron Crème Brûlée", price: 420, category: 'Desserts', diet: 'veg', description: "Silky saffron custard with a glass-like caramelized sugar top." },
  { id: 10, name: "Mango Kulfi Tart", price: 350, category: 'Desserts', diet: 'veg', description: "Traditional mango kulfi sitting in a buttery shortcrust pastry shell." },
  
  // Drinks
  { id: 11, name: "Masala Mojito", price: 320, category: 'Drinks', diet: 'veg', description: "A zesty blend of lime, mint, and secret Indian spice mix." },
  { id: 12, name: "Rose Lassi Martini", price: 380, category: 'Drinks', diet: 'veg', description: "Elegant fusion of vodka, yogurt, and aromatic rose petals." },
  { id: 13, name: "Mint & Turmeric Lemonade", price: 220, category: 'Drinks', diet: 'veg', description: "Refreshing detox blend with fresh turmeric root and mint." },
];

const RESTAURANT_INFO = {
  name: "Zafran & Ember",
  tagline: "Where Tradition Meets Fire",
  address: "14, Sea View Road, Bandra West, Mumbai 400050",
  phone: "+91 98765 43210",
  email: "hello@zafranembar.com",
  timings: "Mon–Fri: 12PM–3PM, 7PM–11PM | Sat–Sun: 12PM–11PM",
  chef: "Chef Aryan Mehra",
  cuisine: "Modern Indian Fusion"
};

// --- Components ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Menu', href: '#menu' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Reservations', href: '#reservations' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-charcoal/95 py-3 shadow-xl' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <a href="#home" className="text-2xl font-serif font-black tracking-tighter text-cream flex items-center gap-2">
          <Flame className="text-gold" />
          <span className="hidden sm:inline">ZAFRAN & EMBER</span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className="text-cream/80 hover:text-gold font-sans text-xs uppercase tracking-widest transition-colors"
            >
              {link.name}
            </a>
          ))}
          <a href="#reservations" className="bg-gold hover:bg-gold/80 text-charcoal px-6 py-2 rounded-full font-sans text-xs uppercase font-bold tracking-widest transition-all">
            Book Now
          </a>
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-cream">
          {isOpen ? <X size={28} /> : <MenuIcon size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-charcoal p-6 flex flex-col gap-4 border-t border-cream/10 md:hidden shadow-2xl"
          >
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                onClick={() => setIsOpen(false)}
                className="text-cream text-lg font-serif border-b border-cream/5 pb-2"
              >
                {link.name}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => (
  <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
    {/* Background Overlay */}
    <div className="absolute inset-0 bg-charcoal/60 z-10" />
    <div 
      className="absolute inset-0 bg-cover bg-center" 
      style={{ backgroundImage: `url('https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=2000')` }}
    />
    
    <div className="relative z-20 text-center px-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-gold font-sans text-sm uppercase tracking-[0.4em] mb-4">Mumbai, Maharashtra</h2>
        <h1 className="text-6xl md:text-8xl font-serif font-black text-cream mb-6 tracking-tight">
          ZAFRAN <br className="sm:hidden" /> & <span className="gold-text-gradient">EMBER</span>
        </h1>
        <p className="text-xl md:text-2xl font-body text-cream/90 italic mb-10 max-w-2xl mx-auto">
          "Where Tradition Meets Fire"
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a href="#reservations" className="bg-gold text-charcoal px-10 py-4 rounded-full font-sans text-sm uppercase font-bold tracking-widest hover:scale-105 transition-all shadow-xl w-full sm:w-auto">
            Reserve a Table
          </a>
          <a href="#menu" className="border border-cream text-cream px-10 py-4 rounded-full font-sans text-sm uppercase font-bold tracking-widest hover:bg-cream hover:text-charcoal transition-all w-full sm:w-auto">
            View Menu
          </a>
        </div>
      </motion.div>
    </div>

    {/* Scroll Indicator */}
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce">
      <div className="w-[1px] h-12 bg-gold/50" />
    </div>
  </section>
);

const About = () => (
  <section id="about" className="py-24 bg-cream text-charcoal">
    <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
      <div className="relative">
        <div className="aspect-[4/5] luxury-gradient rounded-3xl overflow-hidden shadow-2xl relative z-10">
          <img 
            src="https://images.unsplash.com/photo-1583394293214-28ded15ee548?auto=format&fit=crop&q=80&w=1000" 
            alt="Chef" 
            className="w-full h-full object-cover mix-blend-overlay opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-transparent" />
          <div className="absolute bottom-8 left-8">
            <p className="text-gold font-sans text-xs uppercase tracking-widest mb-1">Culinary Mastermind</p>
            <h3 className="text-3xl font-serif font-bold text-cream">Chef Aryan Mehra</h3>
          </div>
        </div>
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-gold animate-pulse opacity-10 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-burgundy rounded-full opacity-5 blur-3xl" />
      </div>

      <div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-burgundy font-sans text-xs uppercase tracking-widest font-bold inline-block mb-4">Our Story</span>
          <h2 className="text-5xl font-serif font-black mb-8 leading-tight">Elevating Heritage <br />Through Innovation</h2>
          <p className="text-lg text-charcoal/80 mb-6 leading-relaxed">
            Zafran & Ember was born from a simple yet profound vision: to take the soul of Indian cooking—the spices of Zafran (Saffron) and the intensity of Ember (Fire)—and reimagine them through a global lens.
          </p>
          <p className="text-lg text-charcoal/80 mb-10 leading-relaxed">
            Michelin-trained Chef Aryan Mehra brings over 15 years of international excellence back to his roots in Mumbai, crafting a menu that marries traditional techniques with avant-garde presentations. Every dish is a conversation between past and future.
          </p>
          <div className="grid grid-cols-2 gap-8 border-t border-charcoal/10 pt-10">
            <div>
              <h4 className="text-2xl font-serif font-bold mb-2">15+</h4>
              <p className="text-xs uppercase tracking-widest opacity-60">Years Excellence</p>
            </div>
            <div>
              <h4 className="text-2xl font-serif font-bold mb-2">3</h4>
              <p className="text-xs uppercase tracking-widest opacity-60">Michelin Mentors</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [activeDiet, setActiveDiet] = useState<Diet | 'All'>('All');

  const filteredItems = MENU_ITEMS.filter(item => {
    const catMatch = activeCategory === 'All' || item.category === activeCategory;
    const dietMatch = activeDiet === 'All' || item.diet === activeDiet;
    return catMatch && dietMatch;
  });

  return (
    <section id="menu" className="py-24 bg-charcoal text-cream overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-serif font-black mb-4">The Collection</h2>
          <div className="w-24 h-1 bg-gold mx-auto" />
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-8 mb-16">
          <div className="flex flex-wrap justify-center gap-4">
            {(['All', 'Starters', 'Mains', 'Desserts', 'Drinks'] as Category[]).map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-8 py-2 rounded-full border text-xs uppercase tracking-widest font-bold transition-all ${activeCategory === cat ? 'bg-gold border-gold text-charcoal' : 'border-cream/20 text-cream/70 hover:border-gold hover:text-gold'}`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex justify-center gap-4">
            {['All', 'veg', 'non-veg'].map(diet => (
              <button
                key={diet}
                onClick={() => setActiveDiet(diet as any)}
                className={`flex items-center gap-2 px-4 py-1 rounded-md text-[10px] uppercase tracking-widest font-bold border transition-all ${activeDiet === diet ? 'bg-cream text-charcoal border-cream' : 'border-cream/10 text-cream/40 hover:text-cream'}`}
              >
                {diet === 'veg' && <Leaf size={12} className="text-green-500" />}
                {diet === 'non-veg' && <Flame size={12} className="text-red-500" />}
                {diet}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Grid */}
        <motion.div 
          layout
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map(item => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group bg-cream/5 border border-cream/10 p-6 rounded-2xl flex flex-col justify-between hover:border-gold/50 transition-all"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs uppercase tracking-widest text-gold font-bold">{item.category}</span>
                    {item.diet === 'veg' ? <Leaf size={16} className="text-green-500" /> : <Flame size={16} className="text-red-500" />}
                  </div>
                  <h3 className="text-xl font-serif font-bold mb-2 group-hover:text-gold transition-colors">{item.name}</h3>
                  <p className="text-sm text-cream/60 leading-relaxed mb-6">{item.description}</p>
                </div>
                <div className="flex justify-between items-center border-t border-cream/10 pt-4">
                  <span className="text-lg font-serif font-black">₹{item.price}</span>
                  <button className="text-gold p-1 hover:scale-110 transition-transform">
                    <ChevronRight size={20} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

const Gallery = () => (
  <section id="gallery" className="py-24 bg-cream">
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-serif font-black">Visual Symphony</h2>
        <p className="text-charcoal/60 uppercase tracking-widest text-xs mt-2">A feast for the eyes</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[250px]">
        <div className="col-span-2 row-span-2 luxury-gradient rounded-3xl overflow-hidden flex items-center justify-center relative">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
          <p className="text-gold/20 font-serif text-8xl font-black italic select-none">Ember</p>
        </div>
        <div className="bg-burgundy/80 rounded-3xl overflow-hidden flex items-center justify-center border-4 border-gold/20">
          <Utensils size={40} className="text-gold/50" />
        </div>
        <div className="bg-charcoal rounded-3xl relative overflow-hidden group">
          <div className="absolute inset-0 luxury-gradient opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center justify-center h-full">
            <span className="text-gold font-serif text-2xl font-bold">Mumbai Soul</span>
          </div>
        </div>
        <div className="col-span-2 bg-gradient-to-r from-gold/40 to-burgundy/40 rounded-3xl" />
        <div className="bg-charcoal rounded-3xl flex items-center justify-center">
           <MapPin size={40} className="text-gold/50" />
        </div>
        <div className="bg-burgundy rounded-3xl flex items-center justify-center">
           <Users size={40} className="text-gold/50" />
        </div>
      </div>
    </div>
  </section>
);

const Reservations = () => {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    guests: '2',
    requests: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <section id="reservations" className="py-24 bg-charcoal text-cream relative">
      {/* Decorative */}
      <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-gold opacity-5 blur-[120px]" />
      
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="bg-cream/5 border border-cream/10 p-12 rounded-[40px] shadow-2xl">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-serif font-black mb-4">Secure Your Table</h2>
            <p className="text-gold/60 uppercase tracking-widest text-xs">Reservations are recommended 24 hours in advance</p>
          </div>

          {isSubmitted ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-20 text-center"
            >
              <div className="w-20 h-20 bg-gold rounded-full flex items-center justify-center mx-auto mb-6">
                <ChevronRight size={40} className="text-charcoal" />
              </div>
              <h3 className="text-3xl font-serif font-bold mb-2">Namaste, {formData.name}!</h3>
              <p className="text-cream/60">We've received your request for {formData.guests} guests on {formData.date}. Our concierge will call you shortly to confirm.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black tracking-widest opacity-60 ml-1">Full Name</label>
                <div className="relative">
                  <input 
                    required
                    type="text" 
                    placeholder="Aryan Mehra"
                    className="w-full bg-charcoal border border-cream/10 rounded-xl px-4 py-4 focus:border-gold outline-none transition-all placeholder:text-cream/20"
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black tracking-widest opacity-60 ml-1">Guests</label>
                <div className="relative">
                  <select 
                    className="w-full bg-charcoal border border-cream/10 rounded-xl px-4 py-4 focus:border-gold outline-none transition-all appearance-none"
                    onChange={e => setFormData({...formData, guests: e.target.value})}
                  >
                    {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} Guests</option>)}
                    <option value="9+">Large Party (9+)</option>
                  </select>
                  <Users size={18} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black tracking-widest opacity-60 ml-1">Date</label>
                <div className="relative">
                  <input 
                    required
                    type="date" 
                    className="w-full bg-charcoal border border-cream/10 rounded-xl px-4 py-4 focus:border-gold outline-none transition-all"
                    onChange={e => setFormData({...formData, date: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black tracking-widest opacity-60 ml-1">Time</label>
                <div className="relative">
                  <select 
                    className="w-full bg-charcoal border border-cream/10 rounded-xl px-4 py-4 focus:border-gold outline-none transition-all appearance-none"
                    onChange={e => setFormData({...formData, time: e.target.value})}
                  >
                    <option value="12:00">12:00 PM</option>
                    <option value="1:00">01:00 PM</option>
                    <option value="7:00">07:00 PM</option>
                    <option value="8:00">08:00 PM</option>
                    <option value="9:00">09:00 PM</option>
                  </select>
                  <Clock size={18} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20" />
                </div>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] uppercase font-black tracking-widest opacity-60 ml-1">Special Requests</label>
                <textarea 
                  placeholder="Anniversary, allergies, or window seat preference..."
                  rows={3}
                  className="w-full bg-charcoal border border-cream/10 rounded-xl px-4 py-4 focus:border-gold outline-none transition-all placeholder:text-cream/20"
                  onChange={e => setFormData({...formData, requests: e.target.value})}
                />
              </div>
              <button 
                type="submit"
                className="md:col-span-2 luxury-gradient text-cream py-5 rounded-xl font-sans font-black uppercase tracking-[0.3em] hover:scale-[1.02] active:scale-95 transition-all shadow-xl border border-gold/30"
              >
                Confirm Booking
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

const Contact = () => (
  <section id="contact" className="py-24 bg-cream text-charcoal">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid lg:grid-cols-3 gap-12">
        {/* Info */}
        <div className="space-y-12">
          <div>
            <h2 className="text-4xl font-serif font-black mb-8 border-b border-charcoal/10 pb-4">Contact Us</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-burgundy/10 p-3 rounded-full text-burgundy">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black tracking-widest opacity-40 mb-1">Our Location</p>
                  <p className="font-serif text-lg">{RESTAURANT_INFO.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-burgundy/10 p-3 rounded-full text-burgundy">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black tracking-widest opacity-40 mb-1">Direct Line</p>
                  <p className="font-serif text-lg font-bold">{RESTAURANT_INFO.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-burgundy/10 p-3 rounded-full text-burgundy">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black tracking-widest opacity-40 mb-1">Inquiries</p>
                  <p className="font-serif text-lg">{RESTAURANT_INFO.email}</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-serif font-bold mb-4 uppercase tracking-widest">Opening Hours</h3>
            <div className="space-y-2 text-sm text-charcoal/70">
              <p>Mon – Fri: 12 PM – 3 PM, 7 PM – 11 PM</p>
              <p>Sat – Sun: 12 PM – 11 PM</p>
              <div className="bg-gold/10 p-4 rounded-xl border border-gold/20 mt-4">
                <p className="text-gold font-bold text-xs uppercase tracking-widest">Happy Hour</p>
                <p className="text-xs">Daily 4 PM – 7 PM | 20% off all Spirits</p>
              </div>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="lg:col-span-2">
          <div className="h-full min-h-[400px] w-full bg-charcoal rounded-[40px] overflow-hidden shadow-2xl border-8 border-white">
            <iframe 
              src="https://www.openstreetmap.org/export/embed.html?bbox=72.820%2C19.050%2C72.835%2C19.065&layer=mapnik&marker=19.058%2C72.827" 
              className="w-full h-full grayscale opacity-80"
              style={{ border: 0 }}
            />
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-charcoal text-cream py-20 border-t border-cream/10">
    <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 mb-20">
      <div className="col-span-2">
        <div className="flex items-center gap-2 mb-6">
          <Flame className="text-gold" />
          <h2 className="text-3xl font-serif font-black tracking-tighter">ZAFRAN & EMBER</h2>
        </div>
        <p className="text-cream/50 max-w-sm mb-8 leading-relaxed">
          Crafting memories through the lens of modern Indian fusion. Join us in the heart of Bandra for a culinary journey unlike any other.
        </p>
        <div className="flex gap-4">
          <a href="#" className="w-10 h-10 border border-cream/20 rounded-full flex items-center justify-center hover:bg-gold hover:text-charcoal hover:border-gold transition-all"><Instagram size={18} /></a>
          <a href="#" className="w-10 h-10 border border-cream/20 rounded-full flex items-center justify-center hover:bg-gold hover:text-charcoal hover:border-gold transition-all"><Facebook size={18} /></a>
          <a href="#" className="w-10 h-10 border border-cream/20 rounded-full flex items-center justify-center hover:bg-gold hover:text-charcoal hover:border-gold transition-all"><Twitter size={18} /></a>
        </div>
      </div>
      
      <div>
        <h4 className="text-gold uppercase tracking-widest font-black text-xs mb-6">Explore</h4>
        <ul className="space-y-4 text-cream/60 text-sm">
          <li><a href="#menu" className="hover:text-cream transition-colors">Digital Menu</a></li>
          <li><a href="#reservations" className="hover:text-cream transition-colors">Booking Policy</a></li>
          <li><a href="#about" className="hover:text-cream transition-colors">Chef Aryan's Vision</a></li>
          <li><a href="#" className="hover:text-cream transition-colors">Private Events</a></li>
        </ul>
      </div>

      <div>
        <h4 className="text-gold uppercase tracking-widest font-black text-xs mb-6">Newsletter</h4>
        <p className="text-xs text-cream/40 mb-4 italic">Join our club for exclusive tastings</p>
        <div className="flex">
          <input type="email" placeholder="Email" className="bg-white/5 border border-white/10 rounded-l-lg px-4 py-2 w-full focus:outline-none focus:border-gold" />
          <button className="bg-gold text-charcoal px-4 rounded-r-lg hover:bg-gold/80"><Send size={16} /></button>
        </div>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-6 pt-10 border-t border-cream/5 flex flex-col md:row justify-between items-center text-[10px] uppercase tracking-[0.2em] opacity-40 gap-4">
      <p>© 2024 Zafran & Ember. All Rights Reserved.</p>
      <div className="flex gap-8">
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
      </div>
    </div>
  </footer>
);

const VoiceAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<'idle' | 'listening' | 'processing' | 'speaking'>('idle');
  const [transcript, setTranscript] = useState('');
  const [history, setHistory] = useState<{user: string, bot: string}[]>([]);
  const [currentResponse, setCurrentResponse] = useState('');
  
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<typeof window.speechSynthesis | null>(null);
  const handleVoiceInputRef = useRef<((text: string) => void) | null>(null);

  useEffect(() => {
    // Initialize Speech Recognition
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        recognition.lang = 'en-IN';
        recognition.continuous = false;
        recognition.interimResults = true;

        recognition.onresult = (event: any) => {
          const result = event.results[event.results.length - 1];
          const text = result[0].transcript;
          setTranscript(text);
          if (result.isFinal && handleVoiceInputRef.current) {
            handleVoiceInputRef.current(text);
          }
        };

        recognition.onend = () => {
          setStatus(prev => (prev === 'listening' ? 'idle' : prev));
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          setStatus(prev => (prev === 'listening' ? 'idle' : prev));
        };
      }

      synthRef.current = window.speechSynthesis;
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.abort();
      if (synthRef.current) synthRef.current.cancel();
    };
  }, []);

  const speak = (text: string) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-IN';
    utterance.rate = 0.9;
    utterance.pitch = 1.1;

    utterance.onstart = () => setStatus('speaking');
    utterance.onend = () => setStatus('idle');
    utterance.onerror = () => setStatus('idle');

    synthRef.current.speak(utterance);
  };

  const handleVoiceInput = async (text: string) => {
    if (!text.trim()) {
      setStatus('idle');
      return;
    }

    setStatus('processing');
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const systemPrompt = `
        You are Ember, a warm and friendly voice assistant for Zafran & Ember restaurant in Mumbai. 
        You speak like a helpful waiter — polite, enthusiastic, and knowledgeable. 

        IMPORTANT RULES:
        - Keep all answers SHORT (2-3 sentences max) because you will be spoken aloud
        - Occasionally use Hindi words: Bilkul!, Zaroor!, Shukriya!, Namaste!
        - Never use bullet points or markdown — speak in natural flowing sentences
        - Always sound welcoming and hungry-making!

        RESTAURANT KNOWLEDGE:
        - Name: Zafran & Ember, Bandra West Mumbai
        - Timings: Mon-Fri 12PM-3PM and 7PM-11PM, Weekends 12PM-11PM
        - Phone: +91 98765 43210
        - Chef: Chef Aryan Mehra (Michelin-trained)

        MENU:
        Starters: Tandoori Broccoli Tikka ₹380, Smoked Duck Seekh Kebab ₹550, Truffle Naan Bruschetta ₹420
        Mains: Butter Chicken Risotto ₹780, Lamb Rogan Josh Wellington ₹1100, Paneer Makhani Ravioli ₹690, Prawn Gassi ₹950
        Desserts: Gulab Jamun Cheesecake ₹380, Saffron Crème Brûlée ₹420, Mango Kulfi Tart ₹350
        Drinks: Masala Mojito ₹320, Rose Lassi Martini ₹380, Mint Turmeric Lemonade ₹220

        SPECIALS: Happy Hour 4PM-7PM — 20% off all drinks
        Reservation: Call us or fill the form on our website
        Recommended for first visit: Butter Chicken Risotto and Gulab Jamun Cheesecake
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ role: 'user', parts: [{ text }] }],
        config: {
          systemInstruction: systemPrompt
        }
      });

      const reply = response.text || "I'm sorry, I couldn't catch that. Could you repeat?";
      setCurrentResponse(reply);
      setHistory(prev => [{ user: text, bot: reply }, ...prev].slice(0, 3));
      speak(reply);
    } catch (error) {
      console.error(error);
      const errorMsg = "I'm having a bit of trouble connecting to the kitchen right now!";
      setCurrentResponse(errorMsg);
      speak(errorMsg);
    }
  };

  useEffect(() => {
    handleVoiceInputRef.current = handleVoiceInput;
  }, [handleVoiceInput]);

  const toggleListening = () => {
    if (status === 'listening') {
      recognitionRef.current?.stop();
      setStatus('idle');
    } else {
      if (synthRef.current) synthRef.current.cancel();
      setTranscript('');
      setCurrentResponse('');
      setStatus('listening');
      recognitionRef.current?.start();
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50, x: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50, x: 50 }}
            className="w-[400px] max-w-[calc(100vw-40px)] bg-charcoal rounded-[40px] shadow-2xl flex flex-col mb-6 overflow-hidden border border-gold/30"
          >
            {/* Header */}
            <div className="p-6 flex justify-between items-center border-b border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full luxury-gradient flex items-center justify-center border-2 border-gold/50 shadow-lg relative">
                  <Flame className="text-gold" size={24} />
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1] }} 
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute inset-0 bg-gold/20 rounded-full blur-md" 
                  />
                </div>
                <div>
                  <h4 className="font-serif font-black tracking-widest text-cream text-lg">EMBER</h4>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gold font-bold">Your Voice Guide 🔥</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-cream/50 hover:text-cream transition-colors bg-white/5 p-2 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            {/* Main Assistant Content */}
            <div className="flex-1 p-8 flex flex-col items-center justify-center min-h-[300px]">
              <div className="relative mb-8">
                {/* Visualizer and Mic Button */}
                <motion.button
                  onClick={toggleListening}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 relative z-10 ${
                    status === 'listening' ? 'bg-red-500 shadow-[0_0_40px_rgba(239,68,68,0.6)]' : 
                    status === 'processing' ? 'bg-gold shadow-[0_0_40px_rgba(212,175,55,0.4)]' :
                    status === 'speaking' ? 'bg-gold shadow-[0_0_40px_rgba(212,175,55,0.4)]' :
                    'bg-gold/10 border-2 border-gold text-gold shadow-lg'
                  }`}
                >
                  {status === 'listening' ? <Mic size={40} className="text-white animate-pulse" /> : 
                   status === 'processing' ? <Loader2 size={40} className="text-charcoal animate-spin" /> :
                   status === 'speaking' ? <Volume2 size={40} className="text-charcoal" /> :
                   <Mic size={40} className="text-gold" />}
                </motion.button>

                {/* Sound Waves when speaking */}
                {status === 'speaking' && (
                  <div className="absolute -inset-8 flex items-center justify-center gap-1">
                    {[1,2,3,4,5].map(i => (
                      <motion.div 
                        key={i}
                        animate={{ height: [10, 40, 10] }}
                        transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                        className="w-1 bg-gold rounded-full"
                      />
                    ))}
                  </div>
                )}
                
                {/* Status Text */}
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap">
                   <p className="text-[10px] uppercase font-black tracking-widest text-gold text-center">
                    {status === 'listening' ? 'Listening...' : 
                     status === 'processing' ? 'Thinking...' :
                     status === 'speaking' ? 'Speaking...' :
                     'Tap to speak'}
                   </p>
                </div>
              </div>

              {/* Real-time Transcripts */}
              <div className="w-full mt-12 bg-white/5 border border-white/10 rounded-3xl p-6 min-h-[120px] flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  {status === 'listening' || transcript ? (
                    <motion.p 
                      key="transcript"
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }}
                      className="text-white text-center text-sm leading-relaxed"
                    >
                      "{transcript || '...'}"
                    </motion.p>
                  ) : currentResponse ? (
                    <motion.p 
                      key="response"
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }}
                      className="text-gold text-center text-sm italic leading-relaxed"
                    >
                      {currentResponse}
                    </motion.p>
                  ) : (
                    <p className="text-cream/30 text-center text-[10px] uppercase tracking-widest leading-loose">
                      "Namaste! How can I help you today?"
                    </p>
                  )}
                </AnimatePresence>
              </div>

              {/* History Preview */}
              {history.length > 0 && (
                <div className="w-full mt-6 space-y-2">
                  <p className="text-[8px] uppercase tracking-[0.2em] text-cream/20 font-black">Past exchanges</p>
                  {history.slice(0, 2).map((h, i) => (
                    <div key={i} className="text-[10px] text-cream/40 flex flex-col gap-0.5 border-l border-gold/20 pl-3">
                      <p className="italic">"{h.user}"</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 text-center border-t border-white/5 bg-white/5">
               <p className="text-[8px] text-cream/20 uppercase tracking-[0.3em] font-black">AI Voice Concierge via Gemini</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button State */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-20 h-20 luxury-gradient rounded-full shadow-2xl flex items-center justify-center text-cream border-4 border-gold/40 group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gold/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        <motion.div
           animate={{ boxShadow: ["0 0 0px 0px rgba(212,175,55,0)", "0 0 30px 10px rgba(212,175,55,0.2)", "0 0 0px 0px rgba(212,175,55,0)"] }}
           transition={{ repeat: Infinity, duration: 2 }}
           className="absolute inset-0 rounded-full"
        />
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X size={32} />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} className="flex flex-col items-center">
              <Mic size={28} className="mb-0.5" />
              <span className="text-[7px] font-black tracking-[0.3em] uppercase">Talk</span>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Tooltip */}
        {!isOpen && (
          <div className="absolute bottom-full right-0 mb-4 bg-charcoal border border-gold/30 px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-2xl">
            <p className="text-gold text-[10px] font-black tracking-widest uppercase">Talk to Ember Voice</p>
          </div>
        )}
      </motion.button>
    </div>
  );
};

// --- Main App ---

export default function App() {
  return (
    <div className="bg-charcoal min-h-screen text-cream font-sans selection:bg-gold selection:text-charcoal overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Menu />
        <Gallery />
        <Reservations />
        <Contact />
      </main>
      <Footer />
      <VoiceAssistant />
    </div>
  );
}
