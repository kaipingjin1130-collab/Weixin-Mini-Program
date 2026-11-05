"""Official service presets, verified 2026-10-29. No credentials here."""
PRESETS = [
    {'id': 'openai', 'name': 'OpenAI（ChatGPT）', 'base_url': 'https://api.openai.com/v1',
     'models': [{'id': 'gpt-6.1-sol', 'name': 'GPT-6.1 Sol · 综合任务'},
                {'id': 'gpt-6-astra', 'name': 'GPT-6 Astra · 复杂推理'},
                {'id': 'gpt-6.1-terra', 'name': 'GPT-6.1 Terra · 图文理解'},
                {'id': 'gpt-6-luna', 'name': 'GPT-6 Luna · 轻量批处理'},
                {'id': 'gpt-5.4-mini', 'name': 'GPT-5.4 mini'}, {'id': 'gpt-5.4', 'name': 'GPT-5.4'}],
     'default_model': 'gpt-6.1-sol'},
    {'id': 'deepseek', 'name': 'DeepSeek', 'base_url': 'https://api.deepseek.com/v1',
     'models': [{'id': 'deepseek-flash', 'name': 'DeepSeek Flash'}, {'id': 'deepseek-v4-pro', 'name': 'DeepSeek V4 Pro'}],
     'default_model': 'deepseek-flash'},
]


def provider_id(base_url):
    return next((p['id'] for p in PRESETS if p['base_url'] == base_url.rstrip('/')), 'custom')
