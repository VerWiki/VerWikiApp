"""
Preconditions:
- Each new level has more tabs/spaces than the level before it
- Items on the same level have the same number of tabs/spaces
- The name and url should be on the SAME line (if the url exists)
- The url should start with https
"""
import sys
import json


def create_new_node(name, url):
    return {"name": name, "url": url, "children": []}


def main(input_filename, output_filename):
    json_obj = {"name": "<root_name>", "url": "<url>", "children": []}
    stack = [json_obj]

    with open(input_filename, "r") as file:
        for line in file:
            line = line.rstrip()
            if line == "":
                continue

            curr_level = len(line) - len(line.lstrip())
            line = line.lstrip()

            https_index = line.find("https")
            if https_index == -1:
                name = line
                url = ""
            else:
                name = line[:https_index].rstrip()
                url = line[https_index:].rstrip()

            new_node = create_new_node(name, url)

            stack[curr_level]["children"].append(new_node)

            # Add another space on the stack if needed
            if len(stack) == curr_level + 1:
                stack.append(None)

            stack[curr_level + 1] = new_node

    with open(output_filename, "w") as file:
        json.dump(json_obj, file, ensure_ascii=False, indent=4)


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print(f"Usage: python {sys.argv[0]} <input-file> <output-file>")
        exit()

    main(sys.argv[1], sys.argv[2])
