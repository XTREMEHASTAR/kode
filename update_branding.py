import os, re

root = r'c:\Users\jaiveer\Downloads\insaas'
ignore_dirs = {'node_modules', '.git', 'dist', 'dist-server'}

target_extensions = ('.ts', '.tsx', '.css', '.html', '.json', '.md', '.js', '.sql')

replaced_count = 0
file_count = 0

for dirpath, dirnames, filenames in os.walk(root):
    dirnames[:] = [d for d in dirnames if d not in ignore_dirs]
    for f in filenames:
        if f.endswith(target_extensions):
            filepath = os.path.join(dirpath, f)
            # Skip python scripts we created
            if f in ('generate_assets.py', 'generate_svgs_and_og.py', 'update_branding.py'):
                continue
            
            try:
                with open(filepath, 'r', encoding='utf-8', errors='ignore') as fp:
                    content = fp.read()
                
                # Perform replacements
                new_content = content
                
                # Replace exact case variations
                new_content = re.sub(r'AuraCore', 'KONTAGI', new_content)
                new_content = re.sub(r'auracore', 'kontagi', new_content)
                new_content = re.sub(r'AURACORE', 'KONTAGI', new_content)
                
                if new_content != content:
                    with open(filepath, 'w', encoding='utf-8') as fp:
                        fp.write(new_content)
                    file_count += 1
                    matches = len(re.findall(r'KONTAGI|kontagi', new_content))
                    replaced_count += matches
                    print(f"Updated {os.path.relpath(filepath, root)}")
            except Exception as e:
                print(f"Error processing {filepath}: {e}")

print(f"\nFinished updating {file_count} files.")
