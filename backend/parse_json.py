"""
Preconditions:
- The first line contains the root node and its url
- Each new level has more tabs/spaces than the level before it
- Items on the same level have the same number of tabs/spaces
- The name and url should be on the SAME line (if the url exists)
- The url should start with http
"""
import sys
import json


def create_new_node(name, url):
    return {"name": name, "url": url, "children": []}


def parse_line(line):
    https_index = line.find("http")
    if https_index == -1:
        name = line
        url = ""
    else:
        name = line[:https_index].rstrip()
        url = line[https_index:].rstrip()

    return name, url


def main(input_filename, output_filename):
    json_obj = {"name": "", "url": "", "children": []}
    stack = [json_obj]
    levels = []

    with open(input_filename, "r") as file:
        # Root node
        first_line = file.readline().strip()
        name, url = parse_line(first_line)
        json_obj["name"] = name
        json_obj["url"] = url

        for line in file:
            line = line.rstrip()
            if line == "":
                continue

            # Allows for the usage of both tabs or spaces
            curr_level = len(line) - len(line.lstrip())
            if not levels or levels[-1] < curr_level:
                levels.append(curr_level)
            curr_level_index = levels.index(curr_level)

            line = line.lstrip()
            name, url = parse_line(line)

            new_node = create_new_node(name, url)

            stack[curr_level_index]["children"].append(new_node)

            # Add another space on the stack if needed
            if len(stack) == curr_level_index + 1:
                stack.append(None)

            stack[curr_level_index + 1] = new_node

    with open(output_filename, "w") as file:
        json.dump(json_obj, file, ensure_ascii=False, indent=4)


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print(f"Usage: python {sys.argv[0]} <input-file> <output-file>")
        exit()

    main(sys.argv[1], sys.argv[2])
