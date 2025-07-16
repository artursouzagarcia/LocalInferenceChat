# Local Inference Chat 💬

Um chat local com IA que utiliza modelos de linguagem diretamente no navegador, sem necessidade de servidor ou conexão com internet para a inferência.

## 🚀 Características

- **Inferência Local**: Executa modelos de IA diretamente no navegador usando WebAssembly
- **Suporte a Múltiplos Modelos**: Compatível com modelos Gemma (2B, 3B, 3-1B)
- **Chat em Tempo Real**: Interface de chat com streaming de respostas
- **Upload de Imagens**: Suporte para envio e visualização de imagens
- **Interface Moderna**: UI responsiva e intuitiva
- **Sem Servidor**: Funciona completamente offline após o carregamento inicial

## 🛠️ Tecnologias Utilizadas

- **React 19**: Framework principal para a interface
- **Vite**: Build tool e servidor de desenvolvimento
- **MediaPipe Tasks GenAI**: Biblioteca do Google para inferência de IA no navegador
- **CSS3**: Estilização moderna da interface

## 📋 Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn
- Navegador moderno com suporte a WebAssembly

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd LocalInferenceChat
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

4. Abra o navegador em `http://localhost:5173`

## 📁 Estrutura do Projeto

```
LocalInferenceChat/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   │   ├── gemma2-2b-it-gpu-int8.bin      # Modelo Gemma 2B
│   │   ├── gemma-3n-E2B-it-int4.task      # Modelo Gemma 3B
│   │   ├── gemma3-1b-it-int4-web.task     # Modelo Gemma 3-1B
│   │   └── react.svg
│   ├── App.jsx                            # Componente principal
│   ├── App.css                            # Estilos da aplicação
│   ├── index.css                          # Estilos globais
│   └── main.jsx                           # Ponto de entrada
├── package.json
├── vite.config.js
└── README.md
```

## 🧠 Modelos Suportados

O projeto inclui três modelos Gemma pré-configurados:

1. **Gemma 2B GPU INT8** (`gemma2-2b-it-gpu-int8.bin`)
   - Modelo de 2 bilhões de parâmetros
   - Otimizado para GPU com quantização INT8

2. **Gemma 3B E2B INT4** (`gemma-3n-E2B-it-int4.task`)
   - Modelo de 3 bilhões de parâmetros
   - Quantização INT4 para melhor performance

3. **Gemma 3-1B Web INT4** (`gemma3-1b-it-4-web.task`) - **Padrão**
   - Modelo de 1 bilhão de parâmetros
   - Otimizado para execução web

## 🎯 Funcionalidades

### Chat de Texto
- Interface de chat intuitiva
- Respostas em streaming (tempo real)
- Histórico de conversas
- Indicador visual de digitação da IA

### Upload de Imagens
- Suporte para upload de imagens
- Visualização inline das imagens enviadas
- Processamento local das imagens

### Controles
- Botão para limpar o chat
- Envio por Enter ou botão
- Interface responsiva

## 🔄 Como Funciona

1. **Inicialização**: O modelo de IA é carregado usando MediaPipe Tasks GenAI
2. **Inferência Local**: As respostas são geradas localmente no navegador
3. **Streaming**: As respostas são exibidas em tempo real conforme são geradas
4. **Processamento**: Tudo acontece no cliente, sem envio de dados para servidores

## ⚙️ Configuração Avançada

### Parâmetros do Modelo

No arquivo `App.jsx`, você pode ajustar os parâmetros do modelo:

```javascript
LlmInference.createFromOptions(genaiFileset, {
    baseOptions: { modelAssetPath: modelFileName },
    maxTokens: 512,        // Máximo de tokens (entrada + saída)
    randomSeed: 1,         // Seed para geração determinística
    topK: 1,              // Número de tokens considerados a cada passo
    temperature: 1.0,      // Randomicidade na geração
})
```

### Trocar Modelo

Para usar um modelo diferente, altere a linha no `App.jsx`:

```javascript
const [modelFileName, setModelFileName] = useState(modelFilesNames[0]); // 0, 1 ou 2
```

## 📚 Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento
- `npm run build`: Cria build de produção
- `npm run preview`: Visualiza build de produção
- `npm run lint`: Executa linting do código

## 🚀 Deploy

Para fazer deploy da aplicação:

1. Crie o build de produção:
```bash
npm run build
```

2. Os arquivos estarão na pasta `dist/`

3. Hospede os arquivos em qualquer servidor web estático

**Nota**: Certifique-se de que o servidor suporte arquivos `.bin` e `.task` e tenha os headers CORS adequados para WebAssembly.

## 🔗 Referências

Este projeto foi desenvolvido baseado na documentação oficial do Google MediaPipe:
- [LLM Inference Web JS - MediaPipe](https://ai.google.dev/edge/mediapipe/solutions/genai/llm_inference/web_js?hl=pt-br#run-task)

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## ⚠️ Limitações

- **Performance**: A velocidade depende do hardware do usuário
- **Memória**: Modelos maiores requerem mais RAM
- **Compatibilidade**: Necessita navegador com suporte a WebAssembly
- **Tamanho**: Os modelos têm tamanhos consideráveis (centenas de MB)

## 🔧 Troubleshooting

### Erro de Inicialização
- Verifique se o navegador suporta WebAssembly
- Certifique-se de que os arquivos de modelo estão na pasta correta

### Performance Lenta
- Experimente modelos menores (1B em vez de 3B)
- Verifique se o dispositivo tem RAM suficiente
- Use navegadores baseados em Chromium para melhor performance

### Problemas de CORS
- Para deploy, configure os headers CORS adequados
- Use um servidor local para desenvolvimento

---

**Desenvolvido com ❤️ usando React e MediaPipe**
