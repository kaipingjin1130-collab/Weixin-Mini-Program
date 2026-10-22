from typing import Literal
from pydantic import Field,SecretStr
from ..knowledge.schemas import Strict,Card


class ModelSettings(Strict):
    enabled:bool=False
    base_url:str=Field(default='https://api.deepseek.com/v1',max_length=500)
    model:str=Field(default='',max_length=128)
    api_key:SecretStr|None=None
    timeout_seconds:int=Field(default=60,ge=5,le=180)
    max_tokens:int=Field(default=6000,ge=256,le=16000)


class Category(Strict):
    code:str=Field(pattern=r'^[a-z][a-z0-9_]{0,63}$')
    name:str=Field(min_length=1,max_length=100)
    focus:str=Field(default='',max_length=2000)
    keywords:list[str]=Field(default_factory=list,max_length=30)


class Taxonomy(Strict):
    project_id:str=Field(max_length=128)
    expected_version:int=Field(ge=0)
    categories:list[Category]=Field(min_length=1,max_length=30)


class Generate(Strict):
    record_version_ids:list[str]=Field(min_length=1,max_length=20)
    taxonomy_id:str=Field(max_length=36)
    mode:Literal['llm','mock']='llm'


class ExtractedCard(Card):
    pass


class Output(Strict):
    cards:list[ExtractedCard]=Field(min_length=1,max_length=10)
    missing_information:list[str]=Field(default_factory=list,max_length=30)
