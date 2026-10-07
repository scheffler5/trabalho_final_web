# MenteSã — Sistema de Agendamento Psiquiátrico

Projeto frontend desenvolvido para a disciplina de Desenvolvimento Web. Sistema de agendamento para clínica psiquiátrica com área pública, autenticação, cadastro de usuários e painel administrativo.

## Tecnologias

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **Shadcn UI** (componentes com Base UI)
- **React Hook Form** + **Zod** (formulários e validação)
- **date-fns** (formatação de datas)

## Como rodar

### Pré-requisitos

- Node.js 20+ instalado
- npm, yarn ou pnpm

### Instalação

```bash
# Clone o repositório
git clone <url-do-repo>
cd Projeto_Front

# Instale as dependências
npm install
```

### Desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no navegador.

### Build de produção

```bash
npm run build
npm run start
```

### Lint

```bash
npm run lint
```

---

## Estrutura de páginas

| Rota | Tipo | Descrição |
|------|------|-----------|
| `/` | Pública | Homepage com apresentação da clínica |
| `/medicos` | Pública | Lista de profissionais aprovados |
| `/sobre` | Pública | Página institucional |
| `/login` | Pública | Login com e-mail e senha |
| `/cadastro` | Pública | Seleção do tipo de cadastro |
| `/cadastro/paciente` | Pública | Formulário de registro para pacientes |
| `/cadastro/profissional` | Pública | Formulário para médicos/profissionais |
| `/admin/registro` | Pública | Cadastro de administrador (requer código secreto) |
| `/dashboard` | **Privada — Paciente** | Área do paciente |
| `/medico` | **Privada — Médico** | Painel do profissional |
| `/admin` | **Privada — Admin** | Gerenciamento de usuários e aprovações |

---

## Sistema de usuários

Os dados ficam em `localStorage` (sem backend). Há usuários de demonstração pré-carregados:

| E-mail | Senha | Perfil |
|--------|-------|--------|
| `paciente@email.com` | `123456` | Paciente (aprovado) |
| `medico@email.com` | `123456` | Médico (aprovado) |
| `admin@email.com` | `123456` | Administrador |
| `pendente@email.com` | `123456` | Médico (pendente) |

### Perfis e permissões

- **Paciente** — acessa `/dashboard`
- **Médico** — acessa `/medico`; cadastro passa por aprovação do admin
- **Admin** — acessa `/admin`; cadastro exige o código `MENTESA2025`

---

## Proteção de rotas

O arquivo `src/proxy.ts` intercepta todas as requisições. Se o usuário tentar acessar uma rota sem permissão, é redirecionado automaticamente para sua área correta. A sessão é mantida via cookie `clinica_auth`.

---

## Validações de formulário

- **CPF**: formato `000.000.000-00`
- **Registro profissional**: 4–8 dígitos (CRM, COREN, CRP, etc.)
- **Senhas**: mínimo 6 caracteres, confirmação obrigatória
- **Admin**: código de acesso validado via Zod
