export const AI_PROVIDERS = [
  {
    id: 'GROQ',
    name: 'Groq',
    badge: 'Ultra Fast',
    description: 'Llama 3.3 70B & Mixtral powered by LPU inference engine',
    models: ['llama-3.3-70b-versatile', 'mixtral-8x7b-32768', 'llama-3.1-8b-instant'],
    defaultModel: 'llama-3.3-70b-versatile',
    latency: '~310ms',
    tokensPerSec: 320,
    color: '#3B82F6'
  },
  {
    id: 'GEMINI',
    name: 'Gemini',
    badge: 'Multimodal',
    description: 'Google Gemini 2.5 Pro with long context window processing',
    models: ['gemini-2.5-pro', 'gemini-2.5-flash', 'gemini-2.0-flash'],
    defaultModel: 'gemini-2.5-flash',
    latency: '~650ms',
    tokensPerSec: 140,
    color: '#10B981'
  },
  {
    id: 'OPENAI',
    name: 'OpenAI',
    badge: 'Standard',
    description: 'GPT-4o industry standard for deep reasoning & precision',
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo'],
    defaultModel: 'gpt-4o',
    latency: '~780ms',
    tokensPerSec: 110,
    color: '#6366F1'
  },
  {
    id: 'CLAUDE',
    name: 'Claude',
    badge: 'High Nuance',
    description: 'Anthropic Claude 3.5 Sonnet optimized for customer support QA tone analysis',
    models: ['claude-3-5-sonnet-20241022', 'claude-3-5-haiku-20241022'],
    defaultModel: 'claude-3-5-sonnet-20241022',
    latency: '~720ms',
    tokensPerSec: 125,
    color: '#F59E0B'
  },
  {
    id: 'DEEPSEEK',
    name: 'DeepSeek',
    badge: 'Deep Reasoner',
    description: 'DeepSeek V3 & Reasoner for logical compliance & policy checking',
    models: ['deepseek-chat', 'deepseek-reasoner'],
    defaultModel: 'deepseek-chat',
    latency: '~580ms',
    tokensPerSec: 180,
    color: '#8B5CF6'
  },
  {
    id: 'OLLAMA',
    name: 'Ollama (On-Prem)',
    badge: 'Zero Data Leak',
    description: 'Run locally in customer infrastructure (Llama 3, Mistral, Qwen)',
    models: ['llama3:latest', 'mistral:latest', 'qwen2.5:latest'],
    defaultModel: 'llama3:latest',
    latency: '~450ms',
    tokensPerSec: 90,
    color: '#EC4899'
  },
  {
    id: 'OPENROUTER',
    name: 'OpenRouter',
    badge: 'Free Tier',
    description: 'Use OpenRouter without credits (Llama 3 8B)',
    models: ['meta-llama/llama-3.1-8b-instruct'],
    defaultModel: 'meta-llama/llama-3.1-8b-instruct',
    latency: '~600ms',
    tokensPerSec: 100,
    color: '#14B8A6'
  },
  {
    id: 'HUGGINGFACE',
    name: 'Hugging Face',
    badge: 'Serverless API',
    description: 'Run massive open-source models directly via Hugging Face Inference API',
    models: ['meta-llama/Llama-3.3-70B-Instruct', 'Qwen/Qwen2.5-72B-Instruct', 'HuggingFaceH4/zephyr-7b-beta'],
    defaultModel: 'meta-llama/Llama-3.3-70B-Instruct',
    latency: '~800ms',
    tokensPerSec: 80,
    color: '#FFD21E'
  },
  {
    id: 'CEREBRAS',
    name: 'Cerebras',
    badge: 'Blazing Fast',
    description: 'Cerebras Wafer-Scale Engine — the fastest AI inference on the planet',
    models: ['llama3.1-8b', 'llama-3.3-70b', 'zai-glm-4.7', 'gpt-oss-120b'],
    defaultModel: 'llama-3.3-70b',
    latency: '~120ms',
    tokensPerSec: 2100,
    color: '#F97316'
  },
  {
    id: 'COHERE',
    name: 'Cohere',
    badge: 'Enterprise',
    description: 'Command R and Command R+ optimized for RAG and complex analysis tasks',
    models: ['command-a-plus-05-2026', 'command-a-03-2025', 'command-r-plus-08-2024', 'command-r-08-2024'],
    defaultModel: 'command-a-plus-05-2026',
    latency: '~800ms',
    tokensPerSec: 75,
    color: '#38A169'
  },
  {
    id: 'GITHUB',
    name: 'GitHub Models',
    badge: 'Multi-Model',
    description: 'Access Llama 3, Phi-3, and GPT-4o directly through GitHub Personal Access Tokens',
    models: ['gpt-4o', 'Meta-Llama-3.1-70B-Instruct', 'Meta-Llama-3.1-8B-Instruct', 'Phi-3-medium-128k-instruct', 'DeepSeek-R1'],
    defaultModel: 'DeepSeek-R1',
    latency: '~650ms',
    tokensPerSec: 100,
    color: '#24292E'
  }
];

export const SEVERITY_LEVELS = [
  { name: 'Critical', color: 'bg-red-500/10 text-red-400 border-red-500/30', border: '#EF4444' },
  { name: 'High', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30', border: '#F59E0B' },
  { name: 'Medium', color: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30', border: '#EAB308' },
  { name: 'Low', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30', border: '#3B82F6' },
  { name: 'Informational', color: 'bg-gray-500/10 text-gray-300 border-gray-500/30', border: '#6B7280' }
];
