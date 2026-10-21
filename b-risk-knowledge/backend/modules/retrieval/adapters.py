"""Explicit local mock vectors; not a trained semantic model or an LLM."""
import hashlib
import math
import re
from functools import lru_cache
import jieba
from ...auth import Problem

CONFIGS = {'mock-hash-64': 64, 'mock-hash-96': 96}
STRATEGY = 'fact-v1'
TOKENIZER = 'jieba-0.42.1+standard-regex-v1'


@lru_cache(maxsize=1)
def tokenizer():
    engine = jieba.Tokenizer()
    # No shared temp caches or user's dictionaries are modified.
    from ...config import settings
    from pathlib import Path
    cache = Path(settings.storage).parent / 'jieba-cache'
    cache.mkdir(parents=True, exist_ok=True)
    engine.tmp_dir = str(cache)
    engine.initialize()
    return engine


def standards(text):
    return re.findall(r'\b(?:GB(?:/T)?|JGJ(?:/T)?|DB\d*(?:/T)?|CJJ(?:/T)?)\s*\d+(?:[.\-—]\d+)*', text.upper())


def normalize(text):
    return re.sub(r'\s+', '', text.upper()).replace('—', '-')


def terms(text):
    words = [w.lower() for w in tokenizer().cut(text) if re.search(r'[\w\u4e00-\u9fff]', w) and len(w.strip()) > 1]
    return sorted(set(words + [normalize(s) for s in standards(text)]))


class MockEmbedding:
    model_version = 'hash-demo-v1'

    def __init__(self, model):
        if model not in CONFIGS:
            raise Problem(422, 'UNKNOWN_EMBEDDING_MODEL', '请选择已注册的向量配置；真实模型尚未配置。')
        self.model, self.dimension = model, CONFIGS[model]

    def embed(self, value):
        # Character n-grams support lexical variation; this is not semantic inference.
        text = normalize(value)
        tokens = terms(value) + [text[i:i+2] for i in range(max(0, len(text)-1))]
        vector = [0.0] * self.dimension
        for token in tokens:
            digest = hashlib.sha256(token.encode('utf-8')).digest()
            vector[int.from_bytes(digest[:4], 'big') % self.dimension] += 1 if digest[4] % 2 else -1
        norm = math.sqrt(sum(x*x for x in vector))
        if not norm:
            vector[0], norm = 1.0, 1.0
        return [x / norm for x in vector]


def get_embedding(model):
    return MockEmbedding(model)


def extract_answer(results):
    # Deterministic extractive answer. No generated facts or invented citation IDs.
    return [{'text': r['text'], 'citation_ids': r['citation_ids']} for r in results]
