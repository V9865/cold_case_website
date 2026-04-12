"""
RAG Database Setup — per-case ChromaDB ingestion.

Loads text documents from per-case subdirectories under ./rag/documents/
and ingests them into separate ChromaDB collections (one per case).
"""

from pathlib import Path
from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
import chromadb
from chromadb.utils.embedding_functions import SentenceTransformerEmbeddingFunction
import os

# Resolve paths relative to this file so CWD doesn't matter
_BASE_DIR = Path(__file__).resolve().parent

# Cases to ingest
CASE_DIRS = ['case001', 'case002', 'case003']

# Create a ChromaDB persistent client
client = chromadb.PersistentClient(path=str(_BASE_DIR / 'chroma_db'))

# Create embedding function
embedding_function = SentenceTransformerEmbeddingFunction(model_name='all-MiniLM-L6-v2')

# Text splitter
text_splitter = RecursiveCharacterTextSplitter(chunk_size=300, chunk_overlap=50)

total_chunks = 0

for case_dir in CASE_DIRS:
    doc_path = str(_BASE_DIR / 'documents' / case_dir)
    collection_name = f'{case_dir}_documents'

    if not os.path.isdir(doc_path):
        print(f'[SKIP] {case_dir} -- directory not found: {doc_path}')
        continue

    # Load all .txt files from the case directory
    loader = DirectoryLoader(doc_path, glob='*.txt', loader_cls=TextLoader)
    docs = loader.load()

    if not docs:
        print(f'[SKIP] {case_dir} -- no .txt files found')
        continue

    # Split loaded docs into chunks
    chunks = text_splitter.split_documents(docs)

    # Delete existing collection if it exists, then recreate
    try:
        client.delete_collection(name=collection_name)
    except Exception:
        pass

    collection = client.get_or_create_collection(
        name=collection_name,
        embedding_function=embedding_function,
    )

    # Add all chunks to the collection
    collection.add(
        documents=[c.page_content for c in chunks],
        ids=[f'{case_dir}_chunk_{i}' for i in range(len(chunks))],
    )

    total_chunks += len(chunks)
    print(f'[OK] {case_dir}: Ingested {len(chunks)} chunks into "{collection_name}"')

print(f'\n[DONE] {total_chunks} total chunks across {len(CASE_DIRS)} cases')
