# SportConnect - Plataforma Esportiva Integrada

## ✨ Visão Geral

SportConnect é uma plataforma completa que conecta **Arenas**, **Atletas** e **Profissionais** (juízes, professores, técnicos) em um só lugar. Desenvolvida com React 18, TypeScript, Tailwind CSS 4 e Motion (Framer Motion).

## 🎨 Design System Skill (Guia de Estilo & Componentes)

Este guia serve como referência técnica para a criação e manutenção de interfaces no ecossistema SportConnect, focando em uma estética **premium**, **mobile-first** e **consistente**.

---

### 1. 🌈 Paleta de Cores e Tokens Semânticos

O sistema utiliza variáveis CSS fundamentais para garantir suporte nativo a **Light/Dark Mode**.

#### **Cores de Marca (Brand)**
- **Primary**: `#030213` (Light) | `oklch(0.985 0 0)` (Dark). Usada para textos principais e elementos de alto destaque.
- **Secondary**: `oklch(0.95 0.0058 264.53)` (Light) | `oklch(0.269 0 0)` (Dark). Usada para fundos alternativos e elementos de suporte.
- **Accent**: `#e9ebef` (Light) | `oklch(0.269 0 0)` (Dark). Usada para destaques sutis e backgrounds de hover.

#### **Cores de Interface (Furniture)**
- **Background**: `#ffffff` (Light) | `oklch(0.145 0 0)` (Dark).
- **Foreground (Texto)**: `oklch(0.145 0 0)` (Light) | `oklch(0.985 0 0)` (Dark).
- **Border**: `rgba(0,0,0,0.1)` (Light) | `oklch(0.269 0 0)` (Dark).
- **Input Background**: `#f3f3f5` (Light) | `oklch(0.269 0 0)` (Dark).

#### **Perfis de Dashboard (Gradientes)**
- **Arena**: `from-[#004ef9] to-[#0066ff]` (Azul Vibrante)
- **Atleta**: `from-[#ff4b00] to-[#ff6b00]` (Laranja Esportivo)
- **Profissional**: `from-purple-500 to-purple-600` (Roxo Real)

---

### 2. 🔲 Estilos de Cards

Os cards são a base da nossa organização de conteúdo.

- **Dashboard Card (Glassmorphism)**:
  - Estilo: `bg-white/80 backdrop-blur-md border border-white/20 shadow-xl`
  - Radius: `var(--radius-xl)` (1.25rem+)
  - Uso: Containers principais em dashboards.
- **Elevated Card**:
  - Estilo: `bg-card border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)]`
  - Hover: `whileHover={{ y: -4, shadow: "0_20px_40px_rgba(0,0,0,0.08)" }}`
  - Uso: Features e listas de itens.
- **Outline Card**:
  - Estilo: `bg-transparent border-2 border-border`
  - Uso: Elementos secundários ou formulários.

---

### 3. 📊 Gráficos e Visualização (Charts)

Integração com **Recharts**, seguindo uma estética minimalista.

- **Paletas de Gráfico**:
  - `Chart 1-5`: Tokens `--chart-1` a `--chart-5` (oklch adaptativo).
- **Estilo Visual**:
  - **Grids**: Sempre horizontais, pontilhados, cor `var(--border)`.
  - **Tooltips**: Customizados com `bg-card`, `border-border` e `rounded-lg`.
  - **Eixos**: Textos em `muted-foreground`, tamanho `12px`, sem linhas de eixo visíveis.
  - **Animações**: Entradas suaves com `duration={1200}`.

---

### 4. ⌨️ Entradas de Dados (Inputs & Forms)

- **Input Minimalista**:
  - `h-12 px-4 rounded-xl bg-input-background border-none focus:ring-2 focus:ring-ring transition-all`
- **Switch/Toggle**:
  - `bg-switch-background` quando inativo, `bg-primary` quando ativo.
- **Labels**:
  - Estilo: `text-sm font-medium text-foreground/80 mb-1.5 ml-1`.

---

### 5. 🖱️ Ações (Buttons & Modals)

- **Botões**:
  - **Primary**: `bg-primary text-primary-foreground hover:opacity-90`
  - **Outline**: `border-2 border-border hover:bg-accent`
  - **Ghost**: `hover:bg-accent text-muted-foreground`
  - **Radius**: Sempre `rounded-full` ou `rounded-xl`.
- **Modais (Dialogs)**:
  - **Overlay**: `bg-black/40 backdrop-blur-sm`
  - **Content**: Entrada via `motion` (scale 0.95 -> 1, opacity 0 -> 1).
  - **Mobile**: Em telas pequenas, modais devem converter para **Drawer** (bottom sheet).

---

### 6. 📱 Mobile-First & Responsividade

- **Breakpoints**: 
  - `xs: 480px`, `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`.
- **Principais Regras**:
  - Grids de Dashboard: `grid-cols-1` em mobile, `grid-cols-2/3` em desktop.
  - Espaçamentos: `p-4` em mobile, `p-8` em desktop.
  - Navegação: Barra inferior ou menu hambúrguer em mobile, sidebar fixa em desktop.

---

## 📁 Estrutura do Projeto

```
/src/app/
├── components/
│   ├── ui/                      # Shadcn/Atomic (Button, Input, Card)
│   ├── Header.tsx               # Global Header
│   └── RouteChangeLoader.tsx    # Transição visual entre rotas
├── pages/
│   ├── Home.tsx                 # Institucional
│   ├── Login.tsx                # Auth multi-perfil
│   └── dashboard/
│       ├── ArenaDashboard.tsx   # Perfil Arena
│       ├── AtletaDashboard.tsx  # Perfil Atleta
│       └── ProfissionalDashboard.tsx # Perfil Profissional
```

## � Tecnologias & Fluxos

- **Auth**: Gerenciada via `AuthContext`, com rotas protegidas (`ProtectedRoute`).
- **Animações**: Uso intensivo de `framer-motion` para transições de página e feedback de UI.
- **Ícones**: Padronizados com `lucide-react`.

---

**Este documento é a "Skill" definitiva para qualquer geração de código ou modificação no SportConnect.**
