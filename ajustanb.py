import os
import nbformat
import uuid

def generate_unique_id():
    """Gera um ID único usando UUID4."""
    return str(uuid.uuid4())

def normalize_notebooks(directory):
    notebooks_processed = 0
    notebooks_modified = 0

    # Caminha pela pasta e todas as subpastas
    for root, dirs, files in os.walk(directory):
        for filename in files:
            if filename.endswith(".ipynb"):
                filepath = os.path.join(root, filename)
                print(f"Processando {filepath}")
                
                with open(filepath, 'r') as f:
                    notebook = nbformat.read(f, as_version=4)

                # Verificar a versão do notebook
                nbformat_version = notebook.get('nbformat', 4)

                cells_modified = False
                for cell in notebook['cells']:
                    if cell['cell_type'] == 'code':
                        # Se a célula de código não tem ID e o nbformat é 5 ou superior, adiciona um
                        if 'id' not in cell and nbformat_version >= 5:
                            cell['id'] = generate_unique_id()
                            cells_modified = True
                        # Se o notebook está na versão 4, remova o campo 'id'
                        elif 'id' in cell and nbformat_version < 5:
                            del cell['id']
                            cells_modified = True

                if cells_modified:
                    notebooks_modified += 1
                    print(f">>> Células modificadas no notebook: {filepath}")
                    with open(filepath, 'w') as f:
                        nbformat.write(notebook, f)
                
                notebooks_processed += 1

    # Resumo final
    print(f"\nResumo:")
    print(f"Total de notebooks processados: {notebooks_processed}")
    print(f"Total de notebooks modificados: {notebooks_modified}")


# Caminho do diretório raiz onde estão os notebooks
directory_path = 'material/aulas'
normalize_notebooks(directory_path)
