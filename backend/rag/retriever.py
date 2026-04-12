from pathlib import Path
import chromadb
from chromadb.utils.embedding_functions import SentenceTransformerEmbeddingFunction

# Load persistent client once at module level
_DB_PATH = str(Path(__file__).resolve().parent / 'chroma_db')
_client = chromadb.PersistentClient(path=_DB_PATH)
_embedding_function = SentenceTransformerEmbeddingFunction(model_name='all-MiniLM-L6-v2')

# Cache collections by name
_collections: dict = {}


def _get_collection(collection_name: str):
    """Get or create a ChromaDB collection, caching for reuse."""
    if collection_name not in _collections:
        _collections[collection_name] = _client.get_or_create_collection(
            name=collection_name,
            embedding_function=_embedding_function,
        )
    return _collections[collection_name]


def retrieve_context(
    query: str,
    suspect_name: str = None,
    collection_name: str = 'case_documents',
) -> str:
    """Query a case-specific collection and return relevant context chunks.

    Args:
        query: The search query string.
        suspect_name: Optional suspect name to prioritize in results.
        collection_name: ChromaDB collection to query (e.g. 'case001_documents').

    Returns:
        Matching document chunks joined by '---' separators, or empty string on error.
    """
    try:
        collection = _get_collection(collection_name)
        results = collection.query(query_texts=[query], n_results=3)
        docs = results['documents'][0]

        if not docs:
            return ''

        # If a suspect name is given, reorder to prefer chunks mentioning that name
        if suspect_name:
            mentions = [d for d in docs if suspect_name.lower() in d.lower()]
            others = [d for d in docs if suspect_name.lower() not in d.lower()]
            docs = mentions + others

        return '\n---\n'.join(docs)
    except Exception:
        return ''
