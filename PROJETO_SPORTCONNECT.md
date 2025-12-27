# SportConnect - Plataforma Esportiva Integrada

## ✨ Visão Geral

SportConnect é uma plataforma completa que conecta **Arenas**, **Atletas** e **Profissionais** (juízes, professores, técnicos) em um só lugar. Desenvolvida com React, TypeScript, Tailwind CSS e Motion (Framer Motion).

## 🎨 Identidade Visual

### Paleta de Cores
- **Azul Escuro**: #000273 (Tecnologia e confiança)
- **Azul Vibrante**: #004ef9 (Movimento e energia)
- **Laranja**: #ff4b00 (Ação e esportividade)
- **Branco Gelo**: #f8f8f8 (Limpeza e contraste)

### Tipografia
- **Títulos**: Montserrat SemiBold Italic
- **Corpo**: Poppins / Inter Regular

## 📁 Estrutura do Projeto

```
/src/app/
├── context/
│   └── AuthContext.tsx          # Gerenciamento de autenticação
├── components/
│   ├── Header.tsx               # Cabeçalho global
│   ├── Footer.tsx               # Rodapé global
│   └── figma/
│       └── ImageWithFallback.tsx
├── pages/
│   ├── Home.tsx                 # Página inicial institucional
│   ├── Login.tsx                # Sistema de login multi-perfil
│   └── dashboard/
│       ├── ArenaDashboard.tsx   # Layout do dashboard Arena
│       ├── AtletaDashboard.tsx  # Dashboard completo Atleta
│       ├── ProfissionalDashboard.tsx # Dashboard completo Profissional
│       └── arena/
│           ├── ArenaHome.tsx    # Dashboard inicial da Arena
│           └── Disponibilidade.tsx # ⭐ Gestão de disponibilidade de quadras
└── App.tsx                      # Roteamento principal
```

## 🌐 Páginas Implementadas

### Site Institucional (Público)
- ✅ **Home** - Hero animado, stats, benefícios, esportes, depoimentos
- ✅ **Arenas** - Apresentação de planos (Starter, Pro, Scale)
- ✅ **Atletas** - Recursos para jogadores
- ✅ **Profissionais** - Informações para juízes e técnicos
- ✅ **Marketplace** - Catálogo de produtos esportivos
- ✅ **Blog** - Artigos sobre gestão, atletas e tecnologia
- ✅ **Parceiros** - Logos de parceiros
- ✅ **Contato** - Formulário de contato

### Sistema de Login
- ✅ **Multi-perfil** - Seleção de tipo (Arena, Atleta, Profissional)
- ✅ **Telas específicas** - Design customizado para cada tipo
- ✅ **Autenticação** - Context API para gerenciamento de sessão

## 🏟️ Dashboard Arena (Completo)

### Módulos Implementados:

#### 1. **Dashboard Inicial**
- KPIs principais (Ocupação, Reservas, Faturamento, No-Show)
- Gráficos de ocupação semanal (LineChart)
- Gráficos de faturamento (BarChart)
- Distribuição de esportes (PieChart)
- Feed de atividades recentes

#### 2. **⭐ Disponibilidade de Quadras** (Funcionalidade Destacada)
- Grade horária visual (6h às 20h)
- Gerenciamento por dia da semana e quadra
- Configuração de esportes, duração, preço e intervalo
- Sistema de bloqueio/desbloqueio de horários
- Cálculo de receita potencial
- Publicação de disponibilidade para atletas
- Design estilo Apple Calendar
- Cards informativos de performance

**Recursos da Tela:**
- Seletor visual de dias da semana
- Seletor de quadras com cores distintas
- Status visual (Disponível/Bloqueado)
- Edição inline de horários
- Instruções de uso integradas
- Métricas de disponibilidade

#### 3. **Reservas e Agenda** (Placeholder)
- Lista de reservas com status
- Filtros por esporte e quadra
- Criação manual de reservas

#### 4. **Financeiro** (Placeholder)
- Relatórios de transações
- PIX Split automático
- Exportação de dados

#### 5. **Relatórios e IA** (Placeholder)
- Previsão de demanda
- Análise de horários rentáveis
- Insights de no-show

#### 6. **Clientes** (Placeholder)
- Lista de usuários
- Histórico de reservas
- Feedback dos clientes

#### 7. **Configurações** (Placeholder)
- Dados da arena
- Esportes oferecidos
- Políticas de cancelamento

## 🏃 Dashboard Atleta (Completo)

### Funcionalidades:
- **Stats Cards**: Ranking, partidas, saldo e vitórias
- **Explorar Arenas**: 
  - Busca por esporte/localização
  - Cards de arenas com distância e avaliação
  - Status de disponibilidade
  - Filtros de esportes oferecidos
- **Mapa Interativo**: Placeholder para arenas próximas
- **Próximas Partidas**: Lista de reservas agendadas
- **Ações Rápidas**: 
  - Meus Grupos
  - Ver Ranking
  - Adicionar Créditos

### Recursos:
- Design moderno com glassmorphism
- Cards interativos com hover effects
- Busca em tempo real
- Avaliação por estrelas
- Indicador de distância

## 👨‍⚖️ Dashboard Profissional (Completo)

### Funcionalidades:
- **Stats Cards**: Trabalhos, comissões, avaliação e histórico
- **Agenda Semanal**:
  - Visualização em grade (7 dias)
  - Status por horário (confirmado/pendente)
  - Valor por trabalho
  - Cores por status
- **Oportunidades**:
  - Listagem de partidas disponíveis
  - Informações de esporte, arena, data/hora
  - Nível da partida
  - Botões Aceitar/Recusar
- **Histórico de Serviços**:
  - Feedbacks recebidos
  - Avaliações por estrelas
  - Arenas trabalhadas
- **Comissões e Pagamentos**:
  - Valores pendentes
  - Histórico mensal
  - Solicitação de saque via PIX

## 🎨 Design e UX

### Características:
- **Glassmorphism**: Efeitos de vidro translúcido
- **Gradientes Suaves**: Transições visuais elegantes
- **Animações**: Motion (Framer Motion) para microinterações
- **Responsivo**: 5 breakpoints (mobile, tablet, notebook, desktop, TV)
- **Transições**: Fade + slide entre telas
- **Hover Effects**: Escala e sombra em botões e cards
- **Sombras Coloridas**: Shadow glow em elementos principais

### Cores por Perfil:
- **Arena**: Gradiente azul (#004ef9 → #0066ff)
- **Atleta**: Gradiente laranja (#ff4b00 → #ff6b00)  
- **Profissional**: Gradiente roxo (purple-500 → purple-600)

## 📊 Tecnologias Utilizadas

- **React 18.3** - Framework principal
- **TypeScript** - Tipagem estática
- **React Router DOM** - Navegação entre páginas
- **Tailwind CSS 4** - Estilização utilitária
- **Motion (Framer Motion 12)** - Animações
- **Recharts** - Gráficos e visualizações
- **Lucide React** - Ícones
- **Context API** - Gerenciamento de estado global

## 🔐 Autenticação

Sistema de autenticação multi-perfil com:
- Context API para estado global
- Protected Routes por tipo de usuário
- Redirecionamento automático para dashboards específicos
- Mock de dados de usuário

## 🚀 Fluxos Principais

### 1. Fluxo Arena
```
Login Arena → Dashboard → Disponibilidade → Configurar Quadras → Publicar
```

### 2. Fluxo Atleta
```
Login Atleta → Dashboard → Explorar Arenas → Ver Horários → Reservar
```

### 3. Fluxo Profissional
```
Login Profissional → Dashboard → Oportunidades → Aceitar → Agenda → Comissões
```

## 📱 Responsividade

O sistema foi desenvolvido com design responsivo completo:
- **Mobile First**: Layout otimizado para smartphones
- **Tablet**: Adaptação para iPads
- **Desktop**: Experiência completa em telas grandes
- **TV**: Suporte para monitores 4K

## 🎯 Destaques do Projeto

### ⭐ Tela de Disponibilidade de Quadras
A funcionalidade mais importante para arenas, permitindo:
- Gerenciamento visual de horários
- Configuração granular (esporte, preço, duração)
- Publicação sincronizada com portal de atletas
- Design inspirado em calendários profissionais
- Cálculo automático de receita potencial

### 🎨 Home Institucional
- Hero section com vídeo de fundo
- Animações suaves com Motion
- Cards de benefícios com ícones
- Carrossel de esportes
- Depoimentos de usuários
- CTA estratégicos

### 📊 Dashboards Completos
Três dashboards totalmente funcionais e distintos, cada um com:
- Design específico por perfil
- KPIs relevantes
- Gráficos interativos
- Ações contextuais

## 💡 Diferenciais

1. **Sistema Multi-Perfil**: Três tipos de usuários integrados
2. **Design Premium**: Glassmorphism e gradientes sofisticados
3. **Funcional**: Dados mockados realistas
4. **Escalável**: Estrutura preparada para backend
5. **Moderno**: Tecnologias atuais (2024/2025)
6. **Completo**: Site + Login + 3 Dashboards + 8 páginas institucionais

## 📝 Próximos Passos (Sugestões)

Para transformar em produção:
1. Integrar com backend (Node.js + Express ou Supabase)
2. Implementar sistema de pagamentos real (PIX)
3. Adicionar WebSockets para atualizações em tempo real
4. Integrar mapas reais (Google Maps ou Mapbox)
5. Sistema de notificações
6. Upload de imagens
7. Chat entre usuários
8. Sistema de avaliações completo
9. Relatórios PDF
10. Aplicativo mobile (React Native)

---

**Desenvolvido com foco em design premium, funcionalidade e experiência do usuário.**
