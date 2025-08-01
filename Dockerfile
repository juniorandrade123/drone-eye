# Etapa 1: Construção da aplicação Angular
FROM node:18 AS build

# Define o diretório de trabalho
WORKDIR /app

ENV PORT=8080
ENV HOST 0.0.0.0


# Copia os arquivos do projeto
COPY package.json package-lock.json ./

# Instala as dependências
RUN npm install --legacy-peer-deps

# Copia todo o código fonte
COPY . .

# Compila o Angular para produção
RUN npm run build -- --configuration=production

# Etapa 2: Configuração do servidor Nginx
FROM nginx:alpine AS deploy

# Copia os arquivos construídos para o diretório do Nginx
COPY --from=build /app/dist/auditoriaamc/* /usr/share/nginx/html

# Copia o arquivo de configuração customizado do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expõe a porta padrão do Nginx
EXPOSE 8080

# Comando para iniciar o servidor Nginx
CMD ["nginx", "-g", "daemon off;"]
