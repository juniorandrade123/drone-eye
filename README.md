# 🛸 DRONE-EYE

**Controle inteligente de SKUs com drones e IA**  
Aplicação desenvolvida com **React**, **TypeScript**, **TailwindCSS** e **Vite**, voltada para visualização e gestão de inventários automatizados via drones.

---

## 📁 Estrutura do Projeto

```
├── public/              # Arquivos públicos (imagens, SVGs, etc.)
│   └── placeholder.svg
├── src/                 # Código-fonte principal
│   ├── components/      # Componentes reutilizáveis da interface
│   ├── hooks/           # Custom hooks (e.g., useFetch, useModal)
│   ├── lib/             # Funções utilitárias, serviços de API, configs
│   ├── pages/           # Páginas principais da aplicação
│   ├── App.tsx          # Componente raiz
│   ├── App.css          # Estilos globais
│   ├── index.tsx        # Ponto de entrada ReactDOM
│   └── main.tsx         # Setup do contexto geral da aplicação
├── tailwind.config.ts   # Configuração do Tailwind CSS
├── vite.config.ts       # Configuração do Vite
├── package.json         # Dependências e scripts
└── dockerfile           # Dockerização da aplicação
```

---

## 🚀 Como rodar o projeto

### Pré-requisitos

- Node.js (v18+ recomendado)
- NPM ou Yarn

### Instalação

```bash
npm install
# ou
yarn
```

### Ambiente de desenvolvimento

```bash
npm run dev
# ou
yarn dev
```

### Build de produção

```bash
npm run build
# ou
yarn build
```

---

## 🧪 Ferramentas e Tecnologias

- ⚛️ **React** (com TypeScript)
- ⚡ **Vite** para bundling e desenvolvimento rápido
- 🎨 **TailwindCSS** para estilização
- 🐳 **Docker** (build containerizado)
- 🔧 **PostCSS** + `postcss.config.js`
- 📏 **ESLint** + **Prettier** (`eslint.config.js`) para linting
- 🔗 **Hooks personalizados** (em `src/hooks/`)
- 🧠 **Arquitetura modular** por páginas, componentes e libs

---

## 🧠 Padrões adotados

- Componentes em PascalCase dentro de `src/components`
- Hooks nomeados com `use*` dentro de `src/hooks`
- Funções utilitárias ou APIs em `src/lib`
- Cada `page` pode conter layout + subcomponentes próprios

---

## 🐳 Docker

Para gerar a imagem:

```bash
docker build -t drone-eye .
```

Para rodar localmente:

```bash
docker run -p 5173:5173 drone-eye
```

---

## 📌 Scripts úteis

| Comando           | Ação                                |
|------------------|-------------------------------------|
| `npm run dev`     | Inicia servidor de desenvolvimento |
| `npm run build`   | Gera build para produção           |
| `npm run lint`    | Executa lint nos arquivos `.ts/.tsx` |

---

## 👨‍💻 Autor

**Geraldo Junior**  
Projeto: DRONE-EYE  
Frontend: React + Tailwind + TypeScript + Vite