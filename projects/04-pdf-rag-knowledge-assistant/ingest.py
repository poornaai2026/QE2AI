import chromadb
import click
from rich.console import Console

console = Console()

@click.command()
@click.option('--data', default='./docs', help='Path to docs folder')
def ingest(data):
    """Chunk and index documents into local ChromaDB."""
    console.print(f"[bold white]Indexing documents from: {data}[/bold white]")
    client = chromadb.PersistentClient(path="./chroma_db")
    collection = client.get_or_create_collection(name="qe_knowledge_base")
    
    # Sample document chunks
    sample_docs = [
        "Authentication Requirements: All user sessions expire after 15 minutes of inactivity. Session tokens must be stored in HTTP-only secure cookies.",
        "Payment Processing: Checkout requires 3D Secure verification for transactions over $100.00. Supported currencies: USD, EUR, GBP.",
        "Error Handling: API endpoints must return RFC 7807 compliant JSON problem details on HTTP 4xx and 5xx responses."
    ]
    
    collection.add(
        documents=sample_docs,
        ids=["doc_01", "doc_02", "doc_03"],
        metadatas=[{"source": "auth_spec.pdf", "page": 12}, {"source": "payments.pdf", "page": 4}, {"source": "api_standards.pdf", "page": 8}]
    )
    console.print(f"[green]✓ Successfully indexed {len(sample_docs)} document chunks into ChromaDB![/green]")

if __name__ == '__main__':
    ingest()
