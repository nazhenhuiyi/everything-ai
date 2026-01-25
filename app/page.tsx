import Link from "next/link";

export default function Home() {
  const currentDate = new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });

  return (
    <div className="min-h-screen bg-[#fcfaf7] text-zinc-900 font-sans selection:bg-zinc-200 dark:bg-zinc-950 dark:text-zinc-100">
      {/* Masthead / Header */}
      <header className="border-b-2 border-zinc-900 mx-6 py-6 md:mx-12 dark:border-zinc-100">
        <div className="flex flex-col md:flex-row justify-between items-baseline gap-4 mb-4">
          <div className="text-xs font-bold uppercase tracking-widest text-zinc-500">
            EST. 2026 — VOL. I NO. 1
          </div>
          <div className="text-xs font-bold uppercase tracking-widest text-zinc-500">
            {currentDate}
          </div>
        </div>
        <h1 className="text-6xl md:text-[10rem] font-serif font-black leading-none tracking-tighter text-center border-y border-zinc-200 py-4 dark:border-zinc-800">
          EVERYTHING AI
        </h1>
        <div className="flex justify-center gap-8 mt-4 uppercase text-[10px] font-bold tracking-[0.2em] text-zinc-400">
          <span>Science</span>
          <span>•</span>
          <span>Culture</span>
          <span>•</span>
          <span>Exploration</span>
        </div>
      </header>

      <main className="mx-6 md:mx-12 py-12">
        {/* Featured Story / Hero */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-b border-zinc-200 pb-16 dark:border-zinc-800">
          <div className="lg:col-span-8">
            <h2 className="text-5xl md:text-7xl font-serif font-medium leading-tight mb-8">
              这一切，<br />
              <span className="italic">皆可探索</span>
            </h2>
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-1">
                <p className="text-xl leading-relaxed text-zinc-700 dark:text-zinc-300 first-letter:text-6xl first-letter:font-serif first-letter:font-bold first-letter:mr-3 first-letter:float-left">
                  在 AI 时代，我们致力于将深度知识以前所未有的方式下发给青少年。通过智能 Skill，让每一个充满好奇心的灵魂都能看透万物的运作逻辑。这不是简单的阅读，而是一场关于理性的远征。
                </p>
                <div className="mt-8">
                  <Link
                    href="/docs"
                    className="inline-block border-2 border-zinc-900 px-10 py-4 text-sm font-bold uppercase tracking-widest hover:bg-zinc-900 hover:text-white transition-colors dark:border-zinc-100 dark:hover:bg-zinc-100 dark:hover:text-zinc-900"
                  >
                    立即进入探索 (Enter Archive)
                  </Link>
                </div>
              </div>
              <aside className="w-full md:w-64 border-l-2 border-zinc-900 pl-6 dark:border-zinc-100">
                <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">Special Feature</h4>
                <p className="text-sm font-medium leading-snug">
                  "AI 不仅是工具，更是观察世界的显微镜。" —— 探索者笔记
                </p>
              </aside>
            </div>
          </div>
          <div className="lg:col-span-4 bg-zinc-900 text-white p-8 dark:bg-zinc-100 dark:text-zinc-900">
            <h3 className="text-2xl font-serif italic mb-6">今日焦点 (Issue Focus)</h3>
            <ul className="space-y-6">
              <li className="group">
                <span className="text-[10px] block mb-1 opacity-50 uppercase tracking-widest">01. Physics</span>
                <Link href="/docs/airplane" className="text-lg font-bold group-hover:underline">飞行的秘密：大飞机为什么能飞起来？</Link>
              </li>
              <li className="group border-t border-zinc-700 pt-6 dark:border-zinc-300">
                <span className="text-[10px] block mb-1 opacity-50 uppercase tracking-widest">02. Engineering</span>
                <Link href="/docs/space-station" className="text-lg font-bold group-hover:underline">太空堡垒：空间站是如何建造的？</Link>
              </li>
              <li className="group border-t border-zinc-700 pt-6 dark:border-zinc-300">
                <span className="text-[10px] block mb-1 opacity-50 uppercase tracking-widest">03. Oceanography</span>
                <Link href="/docs/submarine" className="text-lg font-bold group-hover:underline">深海巨兽：潜水艇在万米深处的生存之道</Link>
              </li>
            </ul>
          </div>
        </section>

        {/* Skills / Editorial Columns */}
        <section className="py-20">
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] whitespace-nowrap">Core Methodologies</h2>
            <div className="h-px w-full bg-zinc-200 dark:bg-zinc-800"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="group">
              <div className="mb-6 h-px w-12 bg-zinc-900 dark:bg-zinc-100"></div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Methodology 01</div>
              <h3 className="text-2xl font-serif font-bold mb-4 italic">深度拆解</h3>
              <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                从第一性原理出发，拆解从日常生活用品到宇宙宏大叙事的一切。我们不相信“黑盒”，我们只相信逻辑。
              </p>
            </div>
            <div className="group">
              <div className="mb-6 h-px w-12 bg-zinc-900 dark:bg-zinc-100"></div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Methodology 02</div>
              <h3 className="text-2xl font-serif font-bold mb-4 italic">视觉转译</h3>
              <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                通过 AI 技术插图，将复杂的文字描述转化为直观的视觉语言。让结构可见，让原理清晰。
              </p>
            </div>
            <div className="group">
              <div className="mb-6 h-px w-12 bg-zinc-900 dark:bg-zinc-100"></div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Methodology 03</div>
              <h3 className="text-2xl font-serif font-bold mb-4 italic">严谨审计</h3>
              <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                科学不容许“大概”。每一行输出都经过多层红队审计与事实核查，确保知识的纯度与精度。
              </p>
            </div>
          </div>
        </section>

        {/* Pull Quote / CTA */}
        <section className="bg-zinc-100 dark:bg-zinc-900 p-12 md:p-24 text-center my-12">
          <blockquote className="max-w-4xl mx-auto">
            <p className="text-3xl md:text-5xl font-serif italic leading-tight mb-8">
              “每一个孩子的好奇心，<br />
              都是改变未来的火种。”
            </p>
            <footer className="text-sm font-bold uppercase tracking-widest text-zinc-500">
              — Contribute Your Curiosity
            </footer>
          </blockquote>
          <div className="mt-12">
            <Link
              href="https://github.com/zilinchen/everything-ai"
              target="_blank"
              className="px-8 py-3 bg-zinc-900 text-white font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              提交你的问题 (Submit Inquiries)
            </Link>
          </div>
        </section>
      </main>

      <footer className="mx-6 md:mx-12 py-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center text-[10px] font-bold uppercase tracking-widest text-zinc-400">
        <div>© 2026 Everything AI Collective</div>
        <div className="mt-4 md:mt-0">Built for the next generation of thinkers</div>
      </footer>
    </div>
  );
}
