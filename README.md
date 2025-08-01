
# 📦 Projeto AMC - Angular App

Esta é uma aplicação web desenvolvida com Angular, focada na organização modular e escalável de funcionalidades, com divisão clara entre componentes, views, serviços e estado (store).

🧩 Estrutura do Projeto

```bash
src/
├── app/
│   ├── app.component.*       # Componente principal
│   ├── app.routes.ts         # Definições de rotas
│   ├── common/               # Componentes e recursos reutilizáveis
│   ├── components/           # Componentes da aplicação
│   ├── core/                 # Serviços principais (ex: autenticação, API)
│   ├── helper/               # Funções utilitárias
│   ├── layouts/              # Templates de layout
│   ├── store/                # Gerenciamento de estado
│   └── views/                # Páginas / funcionalidades principais
```

## 🚀 Começando

### Pré-requisitos

- Node.js (v20 ou superior)
- Angular CLI (`npm install -g @angular/cli`)

### Instalação

```bash
npm install --force
```

### Executando o projeto localmente
```bash
ng serve
```

### Build para produção
```bash
ng build --configuration production
```

## 📁 Diretórios importantes

* core/ – Serviços centrais, interceptadores, guards

* store/ – Implementação de estados com NgRx ou gerenciadores reativos

* views/ – Cada funcionalidade com sua própria pasta (feature modules)

* components/ – Componentes reaproveitáveis da interface

* layouts/ – Diferentes estruturas de layout (ex: público vs autenticado)