import chromadb
import click
from rich.console import Console
from rich.panel import Panel

console = Console()

@click.command()
@click.option('--question', '-q', required=True, help='Query question')
def query(question):
    """Retrieve grounded knowledge chunks with citations."""
    client = chromadb.PersistentClient(path="./chroma_db")
    collection = client.get_or_create_collection(name="qe_knowledge_base")
    
    results = collection.query(
        query_texts=[question],
        n_results=2
    )
    
    console.print(Panel(f"[bold white]Query:[/bold white] {question}", border_style="white"))
    
    if results and results['documents'] and results['documents'][0]:
        for i, doc in enumerate(results['documents'][0]):
            meta = results['metadatas'][0][i]
            console.print(f"\n[bold green]Match {i+1} (Source: {meta['source']}, Page {meta['page']}):[/bold green]")
            console.print(f"[dim]{doc}[/dim]")
    else:
        console.print("[yellow]No matching documents found. Please run ingest.py first.[/yellow]")

if __name__ == '__main__':
    query()
