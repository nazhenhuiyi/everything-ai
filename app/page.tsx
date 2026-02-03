import Link from "next/link";

export default function Home() {
  const currentDate = new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });

  return (
    <div className="min-h-screen bg-[#fcfaf7] text-zinc-900 font-sans selection:bg-zinc-200 dark:bg-zinc-950 dark:text-zinc-100 overflow-x-hidden">
      {/* Masthead / Header */}
      <header className="border-b-2 border-zinc-900 mx-6 py-6 md:mx-12 dark:border-zinc-100 relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-neon-blue/10 skew-edge-left -z-10"></div>
        <div className="flex flex-col md:flex-row justify-between items-baseline gap-4 mb-4">
          <div className="text-xs font-bold uppercase tracking-widest text-zinc-500">
            EST. 2026 — VOL. I NO. 1
          </div>
          <div className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
            <span className="w-2 h-2 bg-vivid-pink rounded-full animate-pulse"></span>
            {currentDate}
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-cyber-yellow/20 -skew-x-12 translate-x-4 translate-y-2 -z-10"></div>
          <h1 className="text-6xl md:text-[10rem] font-serif font-black leading-none tracking-tighter text-center border-y border-zinc-200 py-4 dark:border-zinc-800 relative z-10">
            EVERYTHING AI
          </h1>
        </div>
        <div className="flex justify-center gap-8 mt-4 uppercase text-[10px] font-bold tracking-[0.2em] text-zinc-400">
          <span className="hover:text-neon-blue transition-colors cursor-default">Science</span>
          <span>•</span>
          <span className="hover:text-vivid-pink transition-colors cursor-default">Culture</span>
          <span>•</span>
          <span className="hover:text-cyber-yellow transition-colors cursor-default">Exploration</span>
        </div>
      </header>

      <main className="mx-6 md:mx-12 py-12">
        {/* Featured Story / Hero */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-b border-zinc-200 pb-16 dark:border-zinc-800 relative">
          <div className="lg:col-span-8 relative">
            <div className="absolute -left-12 top-0 w-24 h-full bg-zinc-100/50 dark:bg-zinc-900/50 -skew-x-6 -z-10"></div>
            <h2 className="text-5xl md:text-7xl font-serif font-medium leading-tight mb-8 relative">
              这一切，<br />
              <span className="italic relative">
                皆可探索
                <span className="absolute -bottom-2 left-0 w-full h-1 bg-neon-blue"></span>
              </span>
            </h2>
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-1">
                <p className="text-xl leading-relaxed text-zinc-700 dark:text-zinc-300 first-letter:text-6xl first-letter:font-serif first-letter:font-bold first-letter:mr-3 first-letter:float-left first-letter:text-vivid-pink">
                  在 AI 时代，我们致力于将深度知识以前所未有的方式下发给青少年。通过智能 Skill，让每一个充满好奇心的灵魂都能看透万物的运作逻辑。这不是简单的阅读，而是一场关于理性的远征。
                </p>
                <div className="mt-8 relative inline-block group">
                  <div className="absolute inset-0 bg-neon-blue translate-x-2 translate-y-2 transition-transform group-hover:translate-x-1 group-hover:translate-y-1"></div>
                  <Link
                    href="/archive"
                    className="relative z-10 inline-block border-2 border-zinc-900 bg-white px-10 py-4 text-sm font-bold uppercase tracking-widest hover:bg-zinc-900 hover:text-white transition-colors dark:border-zinc-100 dark:bg-zinc-950 dark:hover:bg-zinc-100 dark:hover:text-zinc-900"
                  >
                    立即进入探索 (Enter Archive)
                  </Link>
                </div>
              </div>
              <aside className="w-full md:w-64 border-l-2 border-zinc-900 pl-6 dark:border-zinc-100 relative">
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyber-yellow"></div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">Special Feature</h4>
                <p className="text-sm font-medium leading-snug">
                  "AI 不仅是工具，更是观察世界的显微镜。" —— 探索者笔记
                </p>
              </aside>
            </div>
          </div>
          <div className="lg:col-span-4 bg-zinc-900 text-white p-8 dark:bg-zinc-100 dark:text-zinc-900 sharp-cut-br relative">
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-vivid-pink -z-10 animate-pulse"></div>
            <h3 className="text-2xl font-serif italic mb-6">今日焦点 (Issue Focus)</h3>
            <ul className="space-y-6">
              <li className="group">
                <span className="text-[10px] block mb-1 opacity-50 uppercase tracking-widest group-hover:text-neon-blue transition-colors">01. Physics</span>
                <Link href="/archive/everything-docs/tech/airplane" className="text-lg font-bold group-hover:underline">飞行的秘密：大飞机为什么能飞起来？</Link>
              </li>
              <li className="group border-t border-zinc-700 pt-6 dark:border-zinc-300">
                <span className="text-[10px] block mb-1 opacity-50 uppercase tracking-widest group-hover:text-vivid-pink transition-colors">02. Engineering</span>
                <Link href="/archive/everything-docs/tech/space-station" className="text-lg font-bold group-hover:underline">太空堡垒：空间站是如何建造的？</Link>
              </li>
              <li className="group border-t border-zinc-700 pt-6 dark:border-zinc-300">
                <span className="text-[10px] block mb-1 opacity-50 uppercase tracking-widest group-hover:text-cyber-yellow transition-colors">03. Oceanography</span>
                <Link href="/archive/everything-docs/tech/submarine" className="text-lg font-bold group-hover:underline">深海巨兽：潜水艇在万米深处的生存之道</Link>
              </li>
            </ul>
          </div>
        </section>

        {/* Skills / Editorial Columns */}
        <section className="py-24 relative">
          <div className="flex items-center gap-4 mb-20">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] whitespace-nowrap">Core Methodologies</h2>
            <div className="h-px w-full bg-zinc-200 dark:bg-zinc-800"></div>
            <div className="flex gap-1">
              <div className="w-3 h-3 bg-neon-blue"></div>
              <div className="w-3 h-3 bg-vivid-pink skew-x-12"></div>
              <div className="w-3 h-3 bg-cyber-yellow -skew-x-12"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
            <div className="group relative">
              <div className="mb-6 h-px w-12 bg-zinc-900 dark:bg-zinc-100 group-hover:w-full transition-all duration-500 group-hover:bg-neon-blue"></div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Methodology 01</div>
              <h3 className="text-2xl font-serif font-bold mb-4 italic">深度拆解</h3>
              <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                从第一性原理出发，拆解从日常生活用品到宇宙宏大叙事的一切。我们不相信“黑盒”，我们只相信逻辑。
              </p>
            </div>
            <div className="group relative md:-translate-y-8">
              <div className="mb-6 h-px w-12 bg-zinc-900 dark:bg-zinc-100 group-hover:w-full transition-all duration-500 group-hover:bg-vivid-pink"></div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Methodology 02</div>
              <h3 className="text-2xl font-serif font-bold mb-4 italic">视觉转译</h3>
              <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                通过 AI 技术插图，将复杂的文字描述转化为直观的视觉语言。让结构可见，让原理清晰。
              </p>
            </div>
            <div className="group relative md:translate-y-4">
              <div className="mb-6 h-px w-12 bg-zinc-900 dark:bg-zinc-100 group-hover:w-full transition-all duration-500 group-hover:bg-cyber-yellow"></div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Methodology 03</div>
              <h3 className="text-2xl font-serif font-bold mb-4 italic">严谨审计</h3>
              <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                科学不容许“大概”。每一行输出都经过多层红队审计与事实核查，确保知识的纯度与精度。
              </p>
            </div>
          </div>
        </section>

        {/* Pull Quote / CTA */}
        <section className="relative my-12 overflow-hidden">
          <div className="absolute inset-0 bg-zinc-900 dark:bg-zinc-100 skew-y-3 translate-y-12"></div>
          <div className="relative z-10 bg-zinc-100 dark:bg-zinc-900 p-12 md:p-24 text-center border-x-4 border-vivid-pink">
            <blockquote className="max-w-4xl mx-auto">
              <p className="text-3xl md:text-5xl font-serif italic leading-tight mb-8">
                “每一个孩子的好奇心，<br />
                <span className="relative">
                  都是改变未来的火种。
                  <span className="absolute -z-10 bottom-1 left-0 w-full h-4 bg-cyber-yellow/30 -rotate-1"></span>
                </span>
              </p>
              <footer className="text-sm font-bold uppercase tracking-widest text-zinc-500 flex items-center justify-center gap-4">
                <span className="w-8 h-px bg-zinc-300"></span>
                — Contribute Your Curiosity
                <span className="w-8 h-px bg-zinc-300"></span>
              </footer>
            </blockquote>
            <div className="mt-12">
              <Link
                href="https://github.com/nazhenhuiyi/everything-ai/issues"
                target="_blank"
                className="inline-flex items-center gap-2 px-8 py-3 bg-zinc-900 text-white font-bold uppercase tracking-widest hover:bg-neon-blue transition-all dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-vivid-pink dark:hover:text-white"
              >
                <span>提交你的问题 (Submit Inquiries)</span>
                <span className="text-lg">→</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="mx-6 md:mx-12 py-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center text-[10px] font-bold uppercase tracking-widest text-zinc-400 relative">
        <div className="absolute top-0 right-12 w-24 h-1 bg-gradient-to-r from-neon-blue via-vivid-pink to-cyber-yellow"></div>
        <div>© 2026 Everything AI Collective</div>
        <div className="mt-4 md:mt-0 flex gap-4">
          <Link href="https://github.com/nazhenhuiyi/everything-ai" target="_blank" className="hover:text-neon-blue transition-colors">GitHub</Link>
          <span>Built for the next generation of thinkers</span>
        </div>
      </footer>
    </div>
  );
}
