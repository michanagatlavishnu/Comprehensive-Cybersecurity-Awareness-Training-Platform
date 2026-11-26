const testimonials = [
  {
    name: "Ananya Sharma",
    role: "Security Analyst",
    text: "CyberAware made phishing awareness training engaging and practical.",
  },
  {
    name: "Rahul Verma",
    role: "IT Admin",
    text: "The phishing simulator helped identify risky user behavior before real attacks.",
  },
  {
    name: "Priya Reddy",
    role: "HR Manager",
    text: "Employees completed training faster and awareness scores improved significantly.",
  },
];

export default function TestimonialSection() {
  return (
    <section className="bg-[#050816] py-24">
      <div className="full-container">
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm uppercase tracking-[6px] text-emerald-400">
            Testimonials
          </p>

          <h2 className="text-5xl font-black">
            Trusted By Security Teams
          </h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {testimonials.map((item) => (
            <div key={item.name} className="glass rounded-3xl p-8">
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-violet-500 text-xl font-bold text-black">
                  {item.name.charAt(0)}
                </div>

                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-slate-400">{item.role}</p>
                </div>
              </div>

              <p className="leading-8 text-slate-300">
                “{item.text}”
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}