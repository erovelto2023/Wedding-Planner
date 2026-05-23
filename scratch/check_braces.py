with open('src/app/globals.css', 'r', encoding='utf-8') as f:
    content = f.read()

line_num = 1
col_num = 1
stack = []

for i, char in enumerate(content):
    if char == '\n':
        line_num += 1
        col_num = 1
    else:
        col_num += 1
        
    if char == '{':
        stack.append((line_num, col_num, char))
    elif char == '}':
        if not stack:
            print(f"Extra closing brace '}}' at line {line_num}, col {col_num}")
        else:
            stack.pop()

for item in stack:
    print(f"Unclosed opening brace '{item[2]}' at line {item[0]}, col {item[1]}")

print("Brace check complete.")
