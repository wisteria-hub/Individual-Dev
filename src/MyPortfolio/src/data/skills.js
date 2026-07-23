// =========================================================
// スキル一覧（プレースホルダー）
// level は自己申告の「目安」(0-100)。断定的な指標ではありません。
// icon は react-icons の名前を文字列で持ち、SkillBadge 側で解決します。
// =========================================================

export const skillCategories = [
  {
    key: 'frontend',
    label: 'Frontend',
    skills: [
      { name: 'React', icon: 'SiReact', level: 85 },
      { name: 'Vue.js', icon: 'SiVuedotjs', level: 75 },
      { name: 'JavaScript', icon: 'SiJavascript', level: 88 },
      { name: 'TypeScript', icon: 'SiTypescript', level: 70 },
      { name: 'HTML5', icon: 'SiHtml5', level: 92 },
      { name: 'CSS3', icon: 'SiCss3', level: 88 },
    ],
  },
  {
    key: 'backend',
    label: 'Backend & Data',
    skills: [
      { name: 'Node.js', icon: 'SiNodedotjs', level: 68 },
      { name: 'Python', icon: 'SiPython', level: 72 },
      { name: 'PostgreSQL', icon: 'SiPostgresql', level: 60 },
      { name: 'REST API', icon: 'TbApi', level: 70 },
    ],
  },
  {
    key: 'tools',
    label: 'Tools',
    skills: [
      { name: 'Git', icon: 'SiGit', level: 82 },
      { name: 'Vite', icon: 'SiVite', level: 78 },
      { name: 'Figma', icon: 'SiFigma', level: 65 },
      { name: 'VS Code', icon: 'TbBrandVscode', level: 90 },
    ],
  },
]
