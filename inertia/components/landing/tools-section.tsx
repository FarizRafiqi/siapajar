import { Link } from '@inertiajs/react'
import { ArrowRight } from 'lucide-react'
import { cn } from '~/lib/utils'
import { ScrollReveal, Stagger, StaggerItem } from '~/components/landing/motion-primitives'
import { expressTools } from '~/components/landing/data'

export function ToolsSection() {
  return (
    <section
      id="tools"
      className="py-20 px-4 sm:px-6 lg:px-8 border-t-2 border-black bg-white dark:bg-neutral-900"
    >
      <div className="max-w-6xl mx-auto space-y-12">
        <ScrollReveal className="text-center space-y-3">
          <span className="badge-kawaii-emerald text-xs font-black">ALAT PRAKTIS</span>
          <h2 className="text-2xl sm:text-4xl font-black text-neutral-950 dark:text-white">
            Semua Kebutuhan Guru Dalam Satu Tempat
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-medium max-w-xl mx-auto">
            Hemat waktu berharga Anda hingga 90% dan fokuskan energi pada interaksi mendalam bersama
            peserta didik.
          </p>
        </ScrollReveal>

        <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" stagger={0.07}>
          {expressTools.map((tool) => {
            const Icon = tool.icon
            return (
              <StaggerItem key={tool.title} className="h-full">
                <div className="group h-full bg-[#FAF7F2] dark:bg-neutral-950 rounded-3xl border-2 border-black p-6 flex flex-col justify-between shadow-[4px_4px_0px_#000000] hover:shadow-[6px_6px_0px_#000000] hover:-translate-y-1 transition-all relative">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div
                        className={cn(
                          'w-12 h-12 rounded-2xl border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000000]',
                          tool.color
                        )}
                      >
                        <Icon className="w-6 h-6 shrink-0 transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110" />
                      </div>
                      {tool.tag && (
                        <span
                          className={cn(
                            'px-2.5 py-0.5 rounded-full border-2 border-black text-[10px] font-black uppercase tracking-wider shadow-[2px_2px_0px_#000000]',
                            tool.tagColor
                          )}
                        >
                          {tool.tag}
                        </span>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="font-black text-lg text-neutral-950 dark:text-white">
                        {tool.title}
                      </h3>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-medium">
                        {tool.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-6">
                    <Link
                      href={tool.href}
                      className="text-xs font-black text-neutral-950 dark:text-white inline-flex items-center gap-1.5 hover:gap-2.5 transition-all group hover:text-emerald-600 dark:hover:text-emerald-400"
                    >
                      <span>Coba Generator</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </StaggerItem>
            )
          })}
        </Stagger>
      </div>
    </section>
  )
}
