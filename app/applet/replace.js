const fs = require('fs');
let code = fs.readFileSync('src/components/CourseDetails.tsx', 'utf8');

const regex = /\{module\.items\.map\(\(item, i\) => \([\s\S]*?<ChevronDown[\s\S]*?<\/div>\s*\)\)\}/m;

const replacement = `\{module.items.map((item: any, i: number) => {
                              const content = (
                                <>
                                  <div className="flex items-center gap-3">
                                    {item.icon}
                                    <span className="font-bold text-slate-700 dark:text-gray-200 group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-colors">{item.title}</span>
                                  </div>
                                  <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-colors" />
                                </>
                              );

                              if (item.url) {
                                return (
                                  <a key={i} href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between w-full text-left bg-white dark:bg-[#151b23] p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-800 transition-colors cursor-pointer group">
                                    {content}
                                  </a>
                                );
                              }

                              return (
                                <div key={i} className="flex items-center justify-between bg-white dark:bg-[#151b23] p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-800 transition-colors cursor-pointer group">
                                  {content}
                                </div>
                              );
                            })}`;


if (regex.test(code)) {
    code = code.replace(regex, replacement);
    fs.writeFileSync('src/components/CourseDetails.tsx', code);
    console.log('regex pass');
}
