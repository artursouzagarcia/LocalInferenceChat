import { useState, useRef, useEffect } from 'react';
import { FilesetResolver, LlmInference } from '@mediapipe/tasks-genai';
import './App.css';
import logo from './assets/react.svg';
import gemma2b from './assets/gemma2-2b-it-gpu-int8.bin';
import gemema3n from './assets/gemma-3n-E2B-it-int4.task';
import gemma31b from './assets/gemma3-1b-it-int4-web.task';

const modelFilesNames = [gemma2b, gemema3n, gemma31b];

function App() {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const fileInputRef = useRef(null);
    const [llmInferenceRunner, setLlmInferenceRunner] = useState(null);
    const [modelFileName, setModelFileName] = useState(modelFilesNames[1]);
    const textAI = useRef(null);

    useEffect(() => {
        initializeLLMInference(modelFileName);
    }, [modelFileName]);

    const initializeLLMInference = async (modelFileName) => {
        if (llmInferenceRunner) return; // Already initialized
        console.log('Initializing LLM Inference Runner with model:', modelFileName);
        try {
            // Placeholder for LLM inference initialization logic
            // This could be an API call to a local inference model
            setLlmInferenceRunner(null); // Replace with actual initialization
            const genaiFileset = await FilesetResolver.forGenAiTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-genai/wasm');
            LlmInference.createFromOptions(genaiFileset, {
                baseOptions: { modelAssetPath: modelFileName },
                // maxTokens: 512,  // The maximum number of tokens (input tokens + output
                //                  // tokens) the model handles.
                // randomSeed: 1,   // The random seed used during text generation.
                // topK: 1,  // The number of tokens the model considers at each step of
                //           // generation. Limits predictions to the top k most-probable
                //           // tokens. Setting randomSeed is required for this to make
                //           // effects.
                // temperature:
                //     1.0,  // The amount of randomness introduced during generation.
                //           // Setting randomSeed is required for this to make effects.
            })
                .then((llm) => {
                    console.log('LLM Inference Runner initialized:', llm);
                    setLlmInferenceRunner(llm); // Store the initialized LLM
                })
                .catch((e) => {
                    console.error('Failed to initialize the task:', e);
                    alert('Failed to initialize the task.');
                });
            console.log('LLM Inference Runner initialized');
        } catch (error) {
            console.error('Failed to initialize LLM Inference Runner:', error);
        }
    };

    const sendMessage = () => {
        if (inputText.trim()) {
            const newMessage = {
                id: Date.now(),
                type: 'text',
                content: inputText,
                timestamp: new Date().toLocaleTimeString(),
                sender: 'user',
            };
            setMessages([...messages, newMessage]);
            setInputText('');
            if (newMessage.sender === 'user') {
                generateIaResponse(newMessage);
            }
        }
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const newMessage = {
                    id: Date.now(),
                    type: 'image',
                    content: e.target.result,
                    filename: file.name,
                    timestamp: new Date().toLocaleTimeString(),
                    sender: 'user',
                };
                setMessages([...messages, newMessage]);
            };
            reader.readAsDataURL(file);
        }
        // Reset input
        event.target.value = '';
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const clearChat = () => {
        setMessages([]);
    };

    const generateIaResponse = (message) => {
        if (!message || message.sender !== 'user') return;

        if (message.type === 'text') {
            // Reset textAI for new message
            textAI.current = '';

            // Criar uma mensagem vazia da IA imediatamente
            const aiMessageId = Date.now() + 1;
            const initialAiResponse = {
                id: aiMessageId,
                type: 'text',
                content: '',
                timestamp: new Date().toLocaleTimeString(),
                sender: 'AI',
                isStreaming: true,
            };

            // Adicionar a mensagem vazia ao chat
            setMessages((prevMessages) => [...prevMessages, initialAiResponse]);

            // Gerar resposta com streaming
            llmInferenceRunner.generateResponse(message.content, (partialResult, done) => {
                if (!done) {
                    console.log('Partial result:', partialResult);
                    textAI.current = textAI.current ? textAI.current + partialResult : partialResult;

                    // Atualizar a mensagem existente com o conteúdo parcial
                    setMessages((prevMessages) =>
                        prevMessages.map((msg) =>
                            msg.id === aiMessageId ? { ...msg, content: textAI.current, isStreaming: true } : msg,
                        ),
                    );
                } else {
                    // Finalizar o streaming
                    const finalContent = textAI.current || partialResult;
                    textAI.current = ''; // Reset for next message

                    setMessages((prevMessages) =>
                        prevMessages.map((msg) =>
                            msg.id === aiMessageId ? { ...msg, content: finalContent, isStreaming: false } : msg,
                        ),
                    );
                }
            });
        } else if (message.type === 'image') {
            // Placeholder for AI response to image
            const aiResponse = {
                id: Date.now() + 1,
                type: 'text',
                content: `Imagem recebida: ${message.filename}`,
                timestamp: new Date().toLocaleTimeString(),
                sender: 'AI',
                isStreaming: false,
            };
            setMessages((prevMessages) => [...prevMessages, aiResponse]);
        }
    };

    if (!llmInferenceRunner) {
        return (
            <div className="loading">
                <p>🔄 Carregando...</p>
            </div>
        );
    }

    return (
        <div className="chat-container">
            <div className="chat-header">
                <h1>💬 Chat Local</h1>
                <button onClick={clearChat} className="clear-btn">
                    🗑️ Limpar
                </button>
            </div>

            <div className="chat-messages">
                {messages.length === 0 ? (
                    <div className="empty-state">
                        <p>👋 Olá! Envie uma mensagem ou imagem para começar.</p>
                    </div>
                ) : (
                    messages.map((message) => (
                        <div key={message.id} className={`message ${message.sender}`}>
                            <div className="message-header">
                                <span className="sender">{message.sender === 'user' ? '👤 Você' : '🤖 IA'}</span>
                                <span className="timestamp">{message.timestamp}</span>
                            </div>
                            <div className="message-content">
                                {message.type === 'text' ? (
                                    <div className={`text-message ${message.isStreaming ? 'streaming' : ''}`}>
                                        <p>{message.content}</p>
                                        {message.isStreaming && <span className="typing-indicator">▊</span>}
                                    </div>
                                ) : (
                                    <div className="image-message">
                                        <img src={message.content} alt={message.filename} />
                                        <p className="filename">📎 {message.filename}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="chat-input">
                <div className="input-row">
                    <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Digite sua mensagem... (Enter para enviar)"
                        rows="1"
                        className="text-input"
                    />
                    <button onClick={() => fileInputRef.current?.click()} className="image-btn" title="Enviar imagem">
                        🖼️
                    </button>
                    <button onClick={sendMessage} disabled={!inputText.trim()} className="send-btn">
                        📤
                    </button>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
            </div>
        </div>
    );
}

export default App;
